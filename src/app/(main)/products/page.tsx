"use client";

import ProductCard from "@/components/product-card";
import { MainSection } from "@/components/ui/main-section";
import { products } from "@/lib/products";
import { motion } from "motion/react";

export default function ProductsPage() {
  return (
    <MainSection className="mx-auto px-4 py-32">
      <section>
        <div className="mb-12 text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold text-[#EBEBEB] md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Our Products
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-[#EBEBEB]/70"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Explore our range of cryptocurrency trading tools and services
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              key={product.id}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>
    </MainSection>
  );
}
