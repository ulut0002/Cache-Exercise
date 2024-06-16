# Cache Exercise

This repository contains an implementation of a basic caching mechanism. The purpose of this exercise is to demonstrate the principles of caching and how it can be utilized to improve performance in various applications.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Caching is a technique used to store frequently accessed data in a temporary storage area, so it can be quickly retrieved when needed. This can significantly reduce the time required to access data and improve the overall performance of an application.

This repository provides a simple implementation of a cache in JavaScript. The cache stores key-value pairs and supports basic operations like adding, retrieving, and deleting entries.

## Features

- **Add Entry:** Add a new key-value pair to the cache.
- **Retrieve Entry:** Retrieve the value associated with a given key.
- **Delete Entry:** Remove a key-value pair from the cache.
- **Clear Cache:** Remove all entries from the cache.
- **Cache Expiry:** Optionally set an expiration time for cache entries.

## Installation

To use this cache implementation in your project, you can clone the repository or download the source code as a ZIP file.

```sh
git clone https://github.com/ulut0002/Cache-Exercise.git
```

Navigate to the project directory:

```sh
cd Cache-Exercise
```

The run the index.html with Live Server.

## Usage

To use the cache, include the cache.js file in your project and create an instance of the cache.

```javascript
const Cache = require("./cache");

// Create a new cache instance
const cache = new Cache();

// Add an entry to the cache
cache.set("key1", "value1");

// Retrieve an entry from the cache
const value = cache.get("key1");
console.log(value); // Output: value1

// Delete an entry from the cache
cache.delete("key1");

// Clear all entries from the cache
cache.clear();
```

## Examples

Here are a few examples demonstrating how to use the cache:

### Adding an Entry

```javascript
cache.set("user1", { name: "Alice", age: 30 });
```

### Retrieving an Entry

```javascript
const user = cache.get("user1");
console.log(user); // Output: { name: 'Alice', age: 30 }
```

### Deleting an Entry

```javascript
cache.delete("user1");
```

### Clearing the Cache

```javascript
cache.clear();
```

### License

This project is licensed under the MIT License.
