#!/bin/bash

# Output file
OUTPUT_FILE="/home/ron/Dev/Test/camper-van-builders/all_builders.csv"

# Get the header from the first file
head -n 1 /home/ron/Dev/Test/camper-van-builders/builders_data_part1.csv > "$OUTPUT_FILE"

# Append the data from all files (skipping headers)
for file in /home/ron/Dev/Test/camper-van-builders/builders_data_part*.csv; do
  # Skip the header line and append to the output file
  tail -n +2 "$file" >> "$OUTPUT_FILE"
done

echo "All CSV files have been combined into $OUTPUT_FILE"
echo "Total number of builders: $(( $(wc -l < "$OUTPUT_FILE") - 1 ))"
