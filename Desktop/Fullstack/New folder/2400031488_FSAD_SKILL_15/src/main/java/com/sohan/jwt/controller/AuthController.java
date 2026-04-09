package com.sohan.jwt.controller;

import com.sohan.jwt.entity.User;
import com.sohan.jwt.repository.UserRepository;
import com.sohan.jwt.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository repo;

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );

        User dbUser = repo.findByUsername(user.getUsername()).orElseThrow();

        return jwtUtil.generateToken(dbUser.getUsername(), dbUser.getRole());
    }
}