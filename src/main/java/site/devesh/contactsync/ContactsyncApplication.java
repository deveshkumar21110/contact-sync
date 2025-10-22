package site.devesh.contactsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"site.devesh.contactsync", "site.devesh.contactsync.mapper"})
@Configuration
@EnableScheduling
public class ContactsyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(ContactsyncApplication.class, args);
	}

}
