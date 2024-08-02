package com.example.GalleryApp.controller;


import com.example.GalleryApp.service.ImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
public class ImageController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println(file);
        String url = imageService.uploadImage(file);
        return ResponseEntity.ok().body("{\"url\": \"" + url + "\"}");
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/images")
    public ResponseEntity<List<String>> listImages() {
        List<String> imageUrls = imageService.listImages();
        return ResponseEntity.ok(imageUrls);
    }
}

