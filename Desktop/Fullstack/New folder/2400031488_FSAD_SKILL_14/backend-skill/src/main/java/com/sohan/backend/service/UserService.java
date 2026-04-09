package com.sohan.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.sohan.backend.model.User;

@Service
public class UserService {

    private Map<String, User> users = new HashMap<>();

    public String register(User user) {
        users.put(user.getUsername(), user);
        return "User registered";
    }

    public User login(User user) {
        User existingUser = users.get(user.getUsername());

        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return existingUser;
        }
        return null;
    }

    public User getProfile(String username) {
        return users.get(username);
    }
}