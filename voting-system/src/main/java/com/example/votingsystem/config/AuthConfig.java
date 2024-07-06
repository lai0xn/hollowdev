package com.example.votingsystem.config;

import com.example.votingsystem.model.USERTYPE;
import com.example.votingsystem.model.User;
import com.example.votingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor

/*
    AuthConfig is used to configure the authentication process
    It is used to configure the authentication provider
    and the userDetailsService

 */
public class AuthConfig {
    private static final Logger log = LoggerFactory.getLogger(AuthConfig.class);
    private final UserRepository userRepository;

    @Bean
    // this is used to load the user from the database
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    // this is used to authenticate the user
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService());
        return provider;
    }

    @Bean
    // this is used to authenticate the user it maps the authentication provider to the authentication manager
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    // this is used to encode the password
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(11);
    }

    // create default admin user
    @Bean
    public CommandLineRunner createDefaultAdminUser() {
        return _ -> {
            try {
                log.info("Creating default admin user");
                log.info("Checking if admin user exists");
                if (!userRepository.existsByUsername("admin")) {
                    log.info("Admin user does not exist, creating default admin user");

                    log.info("Creating default admin user");
                    User user = User.builder()
                            .firstname("admin")
                            .lastname("admin")
                            .username("admin")
                            .email("admin")
                            .password(passwordEncoder().encode("admin"))
                            .usertype(USERTYPE.ADMIN)
                            .build();

                    log.info("Saving default admin user to database");
                    userRepository.save(user);
                }else {
                    log.info("Admin user already exists");
                }
            }catch (Exception e){
                log.error("Error creating default admin user");
            }
        };
    }
}
