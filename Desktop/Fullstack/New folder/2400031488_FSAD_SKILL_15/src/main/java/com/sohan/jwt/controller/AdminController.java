package com.sohan.jwt.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/add")
    public String add() {
        return "Admin: Add operation";
    }

    @GetMapping("/delete")
    public String delete() {
        return "Admin: Delete operation";
    }
}