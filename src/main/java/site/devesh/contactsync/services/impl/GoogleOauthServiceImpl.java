package site.devesh.contactsync.services.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import site.devesh.contactsync.services.GoogleOauthService;

public class GoogleOauthServiceImpl implements GoogleOauthService{

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public void handleGoogleCallback(String code) {
        try {
            // Exchange Authorization code for getting access token and refresh token
            String tokenEndPoint = "https://oauth2.googleapis.com/token";
            Map<String, String> params = new HashMap<>();
            params.put("code", code);
            params.put("client_id" , clientId);
            params.put("client_secret" , clientSecret);
            params.put("redirect_uri" , "https://developers.google.com/oauthplayground");
            params.put("grant_type","authorization_code");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(params,headers);

            restTemplate.postForEntity(tokenEndPoint, request, null);





        } catch (Exception e) {
            // TODO: handle exception
        }
    }
    
}
