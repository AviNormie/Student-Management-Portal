package com.example.sms.service;

import com.example.sms.dto.request.LoginRequest;
import com.example.sms.dto.response.LoginResponse;
import com.example.sms.exception.UnauthorizedException;
import com.example.sms.model.User;
import com.example.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        
        if (userOptional.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOptional.get().getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }
        
        User user = userOptional.get();
        
        // Simple validation for role
        if (!user.getRole().equals(request.getRole())) {
            throw new UnauthorizedException("User does not have the specified role");
        }
        
        return new LoginResponse(
            user.getId(),
            user.getUsername(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }
}