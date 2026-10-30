package com.grocery.util;

import com.grocery.model.Category;
import com.grocery.model.Customer;
import com.grocery.model.Product;
import com.grocery.model.ProductUnit;
import com.grocery.repository.CategoryRepository;
import com.grocery.repository.CustomerRepository;
import com.grocery.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public DataInitializer(CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CustomerRepository customerRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Starting initial grocery catalog seeding into MS SQL Server...");

        // 1. Categories
        Category produce = new Category("Fruits & Vegetables", "Fresh organic farm-to-table produce", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400");
        Category dairy = new Category("Dairy & Eggs", "Farm fresh milk, cheese, butter and eggs", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400");
        Category bakery = new Category("Bakery", "Artisan sourdough, fresh baguettes, and pastries", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400");
        Category beverages = new Category("Beverages", "Cold pressed juices, organic coffee, and teas", "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400");
        Category pantry = new Category("Pantry Staples", "Grains, pulses, organic oils, and spices", "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=400");

        categoryRepository.saveAll(Arrays.asList(produce, dairy, bakery, beverages, pantry));

        // 2. Products
        List<Product> products = Arrays.asList(
                new Product("Organic Royal Gala Apples", "Crisp, sweet, and locally harvested apples",
                        new BigDecimal("3.49"), 120, ProductUnit.KG,
                        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", true, produce),
                new Product("Cavendish Bananas", "Naturally ripened sweet potassium-rich bananas",
                        new BigDecimal("1.29"), 250, ProductUnit.DOZEN,
                        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", true, produce),
                new Product("Baby Spinach (Hydroponic)", "Tender and nutrient packed fresh green baby spinach",
                        new BigDecimal("2.99"), 80, ProductUnit.PACKET,
                        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", true, produce),
                new Product("Organic Hass Avocados", "Creamy, rich avocados ready for salads or guacamole",
                        new BigDecimal("4.50"), 65, ProductUnit.PIECE,
                        "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400", true, produce),

                new Product("Whole Farm Fresh Milk (A2)", "Pure grass-fed homogenized whole milk",
                        new BigDecimal("3.89"), 90, ProductUnit.LITER,
                        "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", false, dairy),
                new Product("Pasture-Raised Organic Eggs", "Grade A golden yolk pasture-raised large eggs",
                        new BigDecimal("5.49"), 150, ProductUnit.DOZEN,
                        "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=400", true, dairy),
                new Product("Artisanal Greek Feta Cheese", "Traditional authentic brine-aged sheep and goat milk feta",
                        new BigDecimal("6.20"), 40, ProductUnit.PACKET,
                        "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400", false, dairy),

                new Product("San Francisco Sourdough Loaf", "Naturally fermented sourdough with crunchy blistered crust",
                        new BigDecimal("4.99"), 35, ProductUnit.PIECE,
                        "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400", false, bakery),
                new Product("French Butter Croissants (4-pack)", "Flaky golden multi-layered buttery croissants",
                        new BigDecimal("5.75"), 50, ProductUnit.PACKET,
                        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", false, bakery),

                new Product("Cold Pressed Valencia Orange Juice", "100% freshly squeezed juice without added sugar",
                        new BigDecimal("4.25"), 60, ProductUnit.LITER,
                        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400", true, beverages),
                new Product("Single Origin Ethiopian Roast Coffee", "Whole bean medium-dark roast with notes of cocoa and citrus",
                        new BigDecimal("12.99"), 45, ProductUnit.PACKET,
                        "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400", true, beverages),

                new Product("Extra Virgin Cold Pressed Olive Oil", "First cold pressed unfiltered Greek Koroneiki olives",
                        new BigDecimal("14.50"), 75, ProductUnit.LITER,
                        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", true, pantry),
                new Product("Organic Quinoa Grain", "Triple-washed high-protein Peruvian white quinoa",
                        new BigDecimal("6.99"), 85, ProductUnit.PACKET,
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", true, pantry)
        );

        productRepository.saveAll(products);

        // 3. Demo Customer
        Customer demoCustomer = new Customer(
                "Alex Johnson",
                "alex.johnson@groceryfresh.com",
                "+1-555-019-2834",
                "452 Silicon Orchard Avenue, Tech City, CA 94016"
        );
        customerRepository.save(demoCustomer);

        log.info("Catalog seeding successfully completed! Loaded {} categories and {} products.",
                categoryRepository.count(), productRepository.count());
    }
}

