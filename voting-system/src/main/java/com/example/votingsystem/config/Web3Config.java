package com.example.votingsystem.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

@Configuration
@RequiredArgsConstructor
public class Web3Config {

    private final Environment environment;

    @Bean
    public Web3j web3j(){
        return Web3j.build(new HttpService(environment.getProperty("WEB3_URL")));
    }
}
