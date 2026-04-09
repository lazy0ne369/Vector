package com.sohan.jwt.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @GetMapping("/profile")
    public String profile() {
        return "Employee Profile";
    }
}