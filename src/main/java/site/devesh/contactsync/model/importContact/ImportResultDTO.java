// package site.devesh.contactsync.model.importContact;

// import java.util.ArrayList;
// import java.util.List;

// import lombok.Data;

// @Data
// public class ImportResultDTO {
//     private int totalRows;
//     private int successCount = 0;
//     private int failedCount = 0;
//     private int skippedCount = 0;
//     private List<ImportError> errors = new ArrayList<>();

//     public void incrementSuccess() {
//         this.successCount++;
//     }

//     public void incrementFailed() {
//         this.failedCount++;
//     }

//     public void incrementSkipped() {
//         this.skippedCount++;
//     }

//     public void addError(int rowNumber, String message) {
//         this.errors.add(new ImportError(rowNumber, message));
//         this.failedCount++;
//     }

//     @Data
//     public static class ImportError {
//         private int rowNumber;
//         private String message;

//         public ImportError(int rowNumber, String message) {
//             this.rowNumber = rowNumber;
//             this.message = message;
//         }
//     }
// }