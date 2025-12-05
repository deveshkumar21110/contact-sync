// package site.devesh.contactsync.services.impl;


// import com.opencsv.CSVReader;
// import com.opencsv.exceptions.CsvException;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import site.devesh.contactsync.repo.UserRepo;
// import site.devesh.contactsync.services.ContactService;

// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.time.LocalDate;
// import java.time.format.DateTimeFormatter;
// import java.util.*;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class ContactImportServiceImpl {

//     private final ContactService contactService;
//     private final UserDetailsService userDetailsService;
//     private final UserRepo userRepo;

//     /**
//      * Import contacts from Google Contacts Export CSV
//      * Optimized for Google's export format with full contact data
//      */
//     @Transactional
//     public ImportResultDTO importFromGoogleCSV(MultipartFile file) throws IOException, CsvException {
//         AppUserDto currentUser = userDetailsService.getCurrentUser();
//         AppUser managedUser = userRepo.findByEmail(currentUser.getEmail());
        
//         if (managedUser == null) {
//             throw new RuntimeException("User not found");
//         }

//         List<String[]> records = readCSV(file);
//         if (records.isEmpty()) {
//             throw new IllegalArgumentException("CSV file is empty");
//         }

//         String[] headers = records.get(0);
//         Map<String, Integer> headerMap = createHeaderMap(headers);
        
//         // Validate it's a Google Contacts CSV
//         validateGoogleContactsCSV(headerMap);

//         ImportResultDTO result = new ImportResultDTO();
//         result.setTotalRows(records.size() - 1);

//         for (int i = 1; i < records.size(); i++) {
//             try {
//                 String[] row = records.get(i);
//                 ContactRequestDTO contactDTO = parseGoogleContactRow(row, headerMap);
                
//                 // Skip empty contacts or system contacts (like Contacts+ sync marker)
//                 if (isEmptyContact(contactDTO) || isSystemContact(row, headerMap)) {
//                     result.incrementSkipped();
//                     log.debug("Skipped empty/system contact at row {}", i + 1);
//                     continue;
//                 }
                
//                 contactService.createContact(contactDTO);
//                 result.incrementSuccess();
//                 log.debug("Successfully imported contact: {} at row {}", 
//                     contactDTO.getFirstName() + " " + contactDTO.getLastName(), i + 1);
                    
//             } catch (Exception e) {
//                 log.error("Error importing contact at row {}: {}", i + 1, e.getMessage(), e);
//                 result.addError(i + 1, e.getMessage());
//             }
//         }

//         log.info("Import completed: {} success, {} failed, {} skipped", 
//             result.getSuccessCount(), result.getFailedCount(), result.getSkippedCount());

//         return result;
//     }

//     private void validateGoogleContactsCSV(Map<String, Integer> headerMap) {
//         // Check for essential Google Contacts export headers
//         if (!headerMap.containsKey("First Name") && !headerMap.containsKey("Last Name")) {
//             throw new IllegalArgumentException("Invalid Google Contacts CSV format. Missing name fields.");
//         }
//     }

//     private List<String[]> readCSV(MultipartFile file) throws IOException, CsvException {
//         try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
//             return reader.readAll();
//         }
//     }

//     private Map<String, Integer> createHeaderMap(String[] headers) {
//         Map<String, Integer> map = new HashMap<>();
//         for (int i = 0; i < headers.length; i++) {
//             map.put(headers[i].trim(), i);
//         }
//         return map;
//     }

//     private ContactRequestDTO parseGoogleContactRow(String[] row, Map<String, Integer> headerMap) {
//         ContactRequestDTO dto = new ContactRequestDTO();

//         // Basic name info
//         dto.setFirstName(getValueOrNull(row, headerMap, "First Name"));
//         dto.setLastName(getValueOrNull(row, headerMap, "Last Name"));
        
//         // Organization info
//         dto.setCompany(getValueOrNull(row, headerMap, "Organization Name"));
//         dto.setJobTitle(getValueOrNull(row, headerMap, "Organization Title"));
        
//         // Profile photo (Google provides full URL)
//         dto.setImageUrl(getValueOrNull(row, headerMap, "Photo"));

//         // Parse all contact details
//         dto.setPhoneNumbers(parsePhoneNumbers(row, headerMap));
//         dto.setEmails(parseEmails(row, headerMap));
//         dto.setAddresses(parseAddresses(row, headerMap));
//         dto.setWebsites(parseWebsites(row, headerMap));
//         dto.setSignificantDates(parseSignificantDates(row, headerMap));
//         dto.setLabels(parseLabels(row, headerMap));

//         dto.setIsFavourite(false);

//         return dto;
//     }

//     private List<PhoneNumberDTO> parsePhoneNumbers(String[] row, Map<String, Integer> headerMap) {
//         List<PhoneNumberDTO> phones = new ArrayList<>();
        
//         // Google export can have many phone numbers
//         for (int i = 1; i <= 15; i++) {
//             String phoneKey = "Phone " + i + " - Value";
//             String labelKey = "Phone " + i + " - Label";
            
//             String phoneValue = getValueOrNull(row, headerMap, phoneKey);
//             if (phoneValue != null && !phoneValue.trim().isEmpty()) {
//                 PhoneNumberDTO phone = new PhoneNumberDTO();
//                 phone.setPhoneNumber(cleanPhoneNumber(phoneValue));
//                 phone.setLabel(mapPhoneLabel(getValueOrNull(row, headerMap, labelKey)));
//                 phones.add(phone);
//             }
//         }
        
//         return phones;
//     }

//     private List<EmailDTO> parseEmails(String[] row, Map<String, Integer> headerMap) {
//         List<EmailDTO> emails = new ArrayList<>();
        
//         // Google export can have many email addresses
//         for (int i = 1; i <= 15; i++) {
//             String emailKey = "E-mail " + i + " - Value";
//             String labelKey = "E-mail " + i + " - Label";
            
//             String emailValue = getValueOrNull(row, headerMap, emailKey);
//             if (emailValue != null && !emailValue.trim().isEmpty()) {
//                 EmailDTO email = new EmailDTO();
//                 email.setEmail(emailValue.trim().toLowerCase());
//                 email.setLabel(mapEmailLabel(getValueOrNull(row, headerMap, labelKey)));
//                 emails.add(email);
//             }
//         }
        
//         return emails;
//     }

//     private List<AddressDTO> parseAddresses(String[] row, Map<String, Integer> headerMap) {
//         List<AddressDTO> addresses = new ArrayList<>();
        
//         // Google export typically has 1-3 addresses
//         for (int i = 1; i <= 5; i++) {
//             AddressDTO address = parseAddress(row, headerMap, i);
//             if (address != null) {
//                 addresses.add(address);
//             }
//         }
        
//         return addresses;
//     }

//     private AddressDTO parseAddress(String[] row, Map<String, Integer> headerMap, int index) {
//         // Google Export provides both formatted and individual fields
//         String formattedKey = "Address " + index + " - Formatted";
//         String streetKey = "Address " + index + " - Street";
//         String cityKey = "Address " + index + " - City";
//         String regionKey = "Address " + index + " - Region";
//         String postalKey = "Address " + index + " - Postal Code";
//         String countryKey = "Address " + index + " - Country";
//         String labelKey = "Address " + index + " - Label";
//         String extendedKey = "Address " + index + " - Extended Address";
//         String poBoxKey = "Address " + index + " - PO Box";
        
//         String formatted = getValueOrNull(row, headerMap, formattedKey);
//         String street = getValueOrNull(row, headerMap, streetKey);
//         String city = getValueOrNull(row, headerMap, cityKey);
//         String country = getValueOrNull(row, headerMap, countryKey);
        
//         // Check if address has any data
//         if (isEmpty(formatted) && isEmpty(street) && isEmpty(city) && isEmpty(country)) {
//             return null;
//         }
        
//         AddressDTO address = new AddressDTO();
        
//         // Prefer individual fields, but use formatted as fallback
//         if (!isEmpty(street)) {
//             address.setStreet(street);
//         } else if (!isEmpty(formatted)) {
//             // Parse formatted address if individual fields are missing
//             address.setStreet(formatted.split("\n")[0]);
//         }
        
//         address.setCity(city);
//         address.setState(getValueOrNull(row, headerMap, regionKey));
//         address.setZipCode(getValueOrNull(row, headerMap, postalKey));
//         address.setCountry(country);
//         address.setLabel(mapAddressLabel(getValueOrNull(row, headerMap, labelKey)));
        
//         return address;
//     }

//     private List<WebsiteDTO> parseWebsites(String[] row, Map<String, Integer> headerMap) {
//         List<WebsiteDTO> websites = new ArrayList<>();
        
//         // Google export can have many websites
//         for (int i = 1; i <= 10; i++) {
//             String websiteKey = "Website " + i + " - Value";
//             String labelKey = "Website " + i + " - Label";
            
//             String websiteValue = getValueOrNull(row, headerMap, websiteKey);
//             if (websiteValue != null && !websiteValue.trim().isEmpty()) {
//                 WebsiteDTO website = new WebsiteDTO();
//                 website.setUrl(cleanUrl(websiteValue));
                
//                 String label = getValueOrNull(row, headerMap, labelKey);
//                 website.setLabel(label != null ? label : "Website");
//                 websites.add(website);
//             }
//         }
        
//         return websites;
//     }

//     private List<SignificantDateDTO> parseSignificantDates(String[] row, Map<String, Integer> headerMap) {
//         List<SignificantDateDTO> dates = new ArrayList<>();
        
//         // Parse Birthday
//         String birthday = getValueOrNull(row, headerMap, "Birthday");
//         if (!isEmpty(birthday)) {
//             LocalDate birthDate = parseDate(birthday);
//             if (birthDate != null) {
//                 SignificantDateDTO date = new SignificantDateDTO();
//                 date.setDate(birthDate);
//                 date.setLabel("Birthday");
//                 dates.add(date);
//             }
//         }
        
//         // Parse Events (Anniversary, etc.)
//         for (int i = 1; i <= 10; i++) {
//             String eventKey = "Event " + i + " - Value";
//             String labelKey = "Event " + i + " - Label";
            
//             String eventValue = getValueOrNull(row, headerMap, eventKey);
//             if (!isEmpty(eventValue)) {
//                 LocalDate eventDate = parseDate(eventValue);
//                 if (eventDate != null) {
//                     SignificantDateDTO date = new SignificantDateDTO();
//                     date.setDate(eventDate);
//                     String label = getValueOrNull(row, headerMap, labelKey);
//                     date.setLabel(label != null ? label : "Event");
//                     dates.add(date);
//                 }
//             }
//         }
        
//         return dates;
//     }

//     private List<LabelDTO> parseLabels(String[] row, Map<String, Integer> headerMap) {
//         String labelsStr = getValueOrNull(row, headerMap, "Labels");
//         if (isEmpty(labelsStr)) {
//             return new ArrayList<>();
//         }

//         // Google uses ::: as separator
//         return Arrays.stream(labelsStr.split(":::"))
//                 .map(String::trim)
//                 .filter(label -> !label.isEmpty())
//                 // Filter out Google's system labels (start with *)
//                 .filter(label -> !label.startsWith("*"))
//                 .distinct()
//                 .map(labelName -> {
//                     LabelDTO dto = new LabelDTO();
//                     dto.setName(labelName);
//                     return dto;
//                 })
//                 .collect(Collectors.toList());
//     }

//     private String getValueOrNull(String[] row, Map<String, Integer> headerMap, String header) {
//         Integer index = headerMap.get(header);
//         if (index != null && index < row.length) {
//             String value = row[index].trim();
//             return value.isEmpty() ? null : value;
//         }
//         return null;
//     }

//     private LocalDate parseDate(String dateStr) {
//         if (isEmpty(dateStr)) {
//             return null;
//         }
        
//         try {
//             // Google uses ISO format (yyyy-MM-dd)
//             return LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
//         } catch (Exception e1) {
//             try {
//                 // Fallback: Try MM/dd/yyyy
//                 return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("MM/dd/yyyy"));
//             } catch (Exception e2) {
//                 try {
//                     // Fallback: Try yyyy/MM/dd
//                     return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"));
//                 } catch (Exception e3) {
//                     log.warn("Failed to parse date '{}'. Skipping this date.", dateStr);
//                     return null;
//                 }
//             }
//         }
//     }

//     private String mapPhoneLabel(String googleLabel) {
//         if (isEmpty(googleLabel)) {
//             return "Mobile";
//         }
        
//         String normalized = googleLabel.trim().toLowerCase();
//         switch (normalized) {
//             case "main":
//             case "mobile":
//                 return "Mobile";
//             case "work":
//                 return "Work";
//             case "home":
//                 return "Home";
//             case "work fax":
//             case "fax":
//                 return "Work Fax";
//             case "home fax":
//                 return "Home Fax";
//             case "pager":
//                 return "Pager";
//             default:
//                 return "Other";
//         }
//     }

//     private String mapEmailLabel(String googleLabel) {
//         if (isEmpty(googleLabel)) {
//             return "Personal";
//         }
        
//         String normalized = googleLabel.trim().toLowerCase();
//         switch (normalized) {
//             case "work":
//                 return "Work";
//             case "home":
//             case "personal":
//                 return "Personal";
//             default:
//                 return "Other";
//         }
//     }

//     private String mapAddressLabel(String googleLabel) {
//         if (isEmpty(googleLabel)) {
//             return "Home";
//         }
        
//         String normalized = googleLabel.trim().toLowerCase();
//         switch (normalized) {
//             case "work":
//                 return "Work";
//             case "home":
//                 return "Home";
//             default:
//                 return "Other";
//         }
//     }

//     private String cleanPhoneNumber(String phone) {
//         if (phone == null) return null;
//         // Remove formatting but keep + for international codes
//         return phone.trim()
//             .replaceAll("[()\\s-]", "")
//             .replaceAll("\\s+", "");
//     }

//     private String cleanUrl(String url) {
//         if (url == null) return null;
//         url = url.trim();
        
//         // Add https:// if no protocol specified
//         if (!url.startsWith("http://") && !url.startsWith("https://")) {
//             return "https://" + url;
//         }
//         return url;
//     }

//     private boolean isEmpty(String value) {
//         return value == null || value.trim().isEmpty();
//     }

//     private boolean isEmptyContact(ContactRequestDTO dto) {
//         // A contact must have at least a name OR email OR phone
//         boolean hasName = !isEmpty(dto.getFirstName()) || !isEmpty(dto.getLastName()) || !isEmpty(dto.getCompany());
//         boolean hasEmail = dto.getEmails() != null && !dto.getEmails().isEmpty();
//         boolean hasPhone = dto.getPhoneNumbers() != null && !dto.getPhoneNumbers().isEmpty();
        
//         return !hasName && !hasEmail && !hasPhone;
//     }

//     private boolean isSystemContact(String[] row, Map<String, Integer> headerMap) {
//         // Skip system contacts like "Contacts+ Support" sync marker
//         String notes = getValueOrNull(row, headerMap, "Notes");
//         if (notes != null && notes.contains("sync-loops")) {
//             return true;
//         }
        
//         String lastName = getValueOrNull(row, headerMap, "Last Name");
//         if ("Support".equals(lastName)) {
//             String company = getValueOrNull(row, headerMap, "Organization Name");
//             if (company == null || company.isEmpty()) {
//                 return true; // Likely a system contact
//             }
//         }
        
//         return false;
//     }
// }