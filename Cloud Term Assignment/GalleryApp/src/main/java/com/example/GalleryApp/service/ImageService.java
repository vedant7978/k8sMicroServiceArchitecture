package com.example.GalleryApp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ImageService {

    private final S3Client s3Client;
    private final String bucketName = "csci5409-vedant";

    public ImageService() {
        AwsSessionCredentials awsCreds = AwsSessionCredentials.create("ASIASLHBAOACPKZGDA53", "9p5I5KbrYxTNhxwpOBHSvLtdTzyXFU+AoVL1+12m", "IQoJb3JpZ2luX2VjEKj//////////wEaCXVzLXdlc3QtMiJHMEUCIBLm6lmoMc8eRFNB8FFvc0voavyLTfBR7zhL6ZiNlkZZAiEAkDuPwnN0WXwXcCpz38KmFSbbUZ+MyWGWv7BtIVlioNgqsgIIkf//////////ARAAGgwxNjE1MzMxNjE0NzYiDHr3VWOub7i8cEXWjCqGAssMJ60Q99zgnqDFxr4LkGY3QH2/+ziCpnyQfNR+4uLo0litfTqe9DyyXHGTbK/tPmqrEriV/rJ06oDymvDj7EuJPxUtSZQ1kTaUR8/DtinKrpVYcVj9NEeRhYbaDo5FNXexQsa9OSdU21mmNWVqP0/2/f3mGsAGHBl8aln7Sh9p6tPqEWurH609PGJ2GNd7xZ1ahi57OzlK6ZLjWKk1zzKHZRgAN6Nbra61i7yiO7XwF73CiB4nIFt9gH2YHoseY5ce2iO6L+FHLZPa+XQdLBucCyr0Kz/iER7olqkVuKfclaw0jpFRw6AhW7ZT5a/5i/PvzAUWHVa+0LjlmNCF5Y6MlW8NfVQwioC0tQY6nQHG7shyMNV9q0+9VVxrc+ZZ9r2BV8p/c4QkNId98fo6aPX6CCNTqhkJzO/ml/xOXZeDhhuQ3dulxsUnoRhXCRkLf2/gK4018INgsXUb69d2FHvK9CCD6ASay00rqCeiPWrkK9RgbgJSjnodUcTLnnRDMwpA3u0Wczkvodmupnwf3yzUfh+jx2jHWiq7ZN+3yj1p1xTh2x0yzpUuY++P");
        this.s3Client = S3Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    public String uploadImage(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        System.out.println(file.getSize()+"-------------------------------------------------");
        String contentType = file.getContentType(); // Get the content type of the file
        System.out.println(fileName);
        InputStream fileInputStream = file.getInputStream();

        // Create PutObjectRequest
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(contentType)
                .build();

        // Upload the file to S3
        PutObjectResponse response = s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(fileInputStream, file.getSize()));

        return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
    }
    public List<String> listImages() {
        ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();
//        System.out.println(s3Client);
        ListObjectsV2Response listObjectsV2Response = s3Client.listObjectsV2(listObjectsV2Request);
        List<String> imageUrls = new ArrayList<>();

        for (S3Object s3Object : listObjectsV2Response.contents()) {
            imageUrls.add("https://" + bucketName + ".s3.amazonaws.com/" + s3Object.key());
        }
//        System.out.println(imageUrls);
        return imageUrls;
    }
}

