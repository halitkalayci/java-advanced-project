import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ResponseOptions } from 'angular-in-memory-web-api';
import { v4 as uuid } from 'uuid';
import { Product, CartItem, Cart, Order, OrderItem, OrderStatus, ShippingAddress } from '../models';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const now = new Date().toISOString();

    // Kategoriler
    const categories = [
      'Electronics',
      'Clothing', 
      'Books',
      'Home',
      'Sports',
      'Beauty',
      'Toys',
      'Garden'
    ];

    // Ürünler - Türkçe isimler ve gerçekçi fiyatlar
    const products: Product[] = [
      {
        id: uuid(),
        name: 'Kablosuz Kulaklık Pro Max',
        description: 'Aktif gürültü engelleme özellikli premium kablosuz kulaklık. 30 saat pil ömrü ve hızlı şarj desteği.',
        price: 2899,
        stock: 34,
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Electronics',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Mekanik Klavye RGB 87-Key',
        description: 'Cherry MX Blue switch\'li mekanik klavye. RGB arka aydınlatma ve programlanabilir tuşlar.',
        price: 1499,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Electronics',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: '4K UHD Monitör 27" IPS',
        description: '27 inç 4K UHD çözünürlük, IPS panel teknolojisi. HDR10 desteği ve 99% sRGB renk gamı.',
        price: 7999,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Electronics',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Akıllı Saat Series 7',
        description: 'GPS özellikli akıllı saat. Kalp ritmi takibi, su geçirmez tasarım ve 7 gün pil ömrü.',
        price: 3299,
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Electronics',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Wireless Gaming Mouse',
        description: 'Profesyonel oyuncu mouse\'u. 25.600 DPI hassasiyet ve programlanabilir tuşlar.',
        price: 899,
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Electronics',
        createdAt: now,
        updatedAt: now
      },

      // Giyim ürünleri
      {
        id: uuid(),
        name: 'Oversize Basic T-Shirt',
        description: '%100 pamuk, oversize kesim t-shirt. Yumuşak dokulu ve solmayan renkler.',
        price: 249,
        stock: 85,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Clothing',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Slim Fit Jean Pantolon',
        description: 'Klasik mavi jean pantolon. Slim fit kesim, strech kumaş ve rahat hareket.',
        price: 599,
        stock: 72,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Clothing',
        createdAt: now,
        updatedAt: now
      },

      // Ev & Yaşam
      {
        id: uuid(),
        name: 'Minimalist Table Lamp',
        description: 'Modern tasarım masa lambası. Dokunmatik kontrol ve dimmer özelliği.',
        price: 899,
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Home',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Ceramic Coffee Mug Set',
        description: '4\'lü seramik kahve kupası seti. Mikrodalga ve bulaşık makinesi uyumlu.',
        price: 299,
        stock: 120,
        imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Home',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Wooden Wall Clock',
        description: 'Doğal ahşap duvar saati. Sessiz motor ve modern tasarım.',
        price: 449,
        stock: 33,
        imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Home',
        createdAt: now,
        updatedAt: now
      },

      // Spor ürünleri
      {
        id: uuid(),
        name: 'Professional Running Shoes',
        description: 'Profesyonel koşu ayakkabısı. Hava yastığı teknolojisi ve nefes alan kumaş.',
        price: 1799,
        stock: 28,
        imageUrl: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Sports',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Premium Yoga Mat',
        description: 'Kaymaz yoga matı. 6mm kalınlık, ekolojik malzeme ve taşıma askısı.',
        price: 349,
        stock: 70,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Sports',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Resistance Band Set',
        description: '5 farklı direnç seviyeli elastik bant seti. Kapı ankrajı ve egzersiz rehberi dahil.',
        price: 219,
        stock: 90,
        imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Sports',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Adjustable Dumbbell Set',
        description: 'Ayarlanabilir dumbbell seti 2x20kg. Hızlı ağırlık değişimi ve sağlam yapı.',
        price: 2299,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Sports',
        createdAt: now,
        updatedAt: now
      },

      // Kitaplar
      {
        id: uuid(),
        name: 'JavaScript: The Complete Guide',
        description: 'Modern JavaScript programlama rehberi. ES6+ özellikleri ve pratik örnekler.',
        price: 189,
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Books',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuid(),
        name: 'Clean Code Handbook',
        description: 'Temiz kod yazma sanatı. Best practices ve kod kalitesi geliştirme teknikleri.',
        price: 159,
        stock: 38,
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center&auto=format&q=75',
        category: 'Books',
        createdAt: now,
        updatedAt: now
      }
    ];

    // Varsayılan kullanıcı sepeti (mock için userId = 'current-user')
    const cart: Cart = {
      id: uuid(),
      userId: 'current-user',
      items: [],
      totalAmount: 0,
      createdAt: now,
      updatedAt: now
    };

    // Örnek siparişler
    const orders: Order[] = [
      {
        id: uuid(),
        userId: 'current-user',
        items: [
          {
            id: uuid(),
            productId: products[0].id,
            productName: products[0].name,
            productImageUrl: products[0].imageUrl,
            quantity: 1,
            unitPrice: products[0].price,
            totalPrice: products[0].price
          }
        ],
        shippingAddress: {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          addressLine1: 'Atatürk Caddesi No: 123',
          addressLine2: 'Daire 5',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '05XX XXX XX XX'
        },
        totalAmount: products[0].price,
        status: OrderStatus.DELIVERED,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün önce
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: uuid(),
        userId: 'current-user',
        items: [
          {
            id: uuid(),
            productId: products[6].id,
            productName: products[6].name,
            productImageUrl: products[6].imageUrl,
            quantity: 2,
            unitPrice: products[6].price,
            totalPrice: products[6].price * 2
          },
          {
            id: uuid(),
            productId: products[7].id,
            productName: products[7].name,
            productImageUrl: products[7].imageUrl,
            quantity: 1,
            unitPrice: products[7].price,
            totalPrice: products[7].price
          }
        ],
        shippingAddress: {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          addressLine1: 'Atatürk Caddesi No: 123',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '05XX XXX XX XX'
        },
        totalAmount: products[6].price * 2 + products[7].price,
        status: OrderStatus.SHIPPED,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 gün önce
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return { 
      products, 
      categories, 
      cart: [cart], // InMemory API koleksiyon olarak bekliyor
      orders 
    };
  }

  // Custom URL mapping ve response handling
  get(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // GET /api/v1/cart - Sepeti getir
    if (url.includes('/api/v1/cart') && !url.includes('/items')) {
      return this.handleGetCart(reqInfo);
    }

    // GET /api/v1/products - Ürünleri getir (pagination ve search desteği)
    if (url.includes('/api/v1/products') && !url.includes('/categories')) {
      return this.handleGetProducts(reqInfo);
    }

    // GET /api/v1/products/categories - Kategorileri getir
    if (url.includes('/api/v1/products/categories')) {
      return this.handleGetCategories(reqInfo);
    }

    // GET /api/v1/orders - Siparişleri getir
    if (url.includes('/api/v1/orders')) {
      return this.handleGetOrders(reqInfo);
    }

    return undefined; // Default behavior
  }

  post(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // POST /api/v1/cart/items - Sepete ürün ekle
    if (url.includes('/api/v1/cart/items')) {
      return this.handleAddToCart(reqInfo);
    }

    // POST /api/v1/orders/checkout - Checkout işlemi
    if (url.includes('/api/v1/orders/checkout')) {
      return this.handleCheckout(reqInfo);
    }

    return undefined;
  }

  put(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // PUT /api/v1/cart/items/:id - Sepet item güncelle
    if (url.includes('/api/v1/cart/items/')) {
      return this.handleUpdateCartItem(reqInfo);
    }

    return undefined;
  }

  delete(reqInfo: RequestInfo) {
    const url = reqInfo.req.url;

    // DELETE /api/v1/cart/items/:id - Sepet item sil
    if (url.includes('/api/v1/cart/items/')) {
      return this.handleRemoveCartItem(reqInfo);
    }

    // DELETE /api/v1/cart - Sepeti temizle
    if (url.includes('/api/v1/cart') && !url.includes('/items')) {
      return this.handleClearCart(reqInfo);
    }

    return undefined;
  }

  // Handler Methods
  private handleGetCart(reqInfo: RequestInfo) {
    const db = reqInfo.utils.getDb() as any;
    const cart = db.cart[0];
    
    // Cart items'ları product bilgileriyle zenginleştir
    cart.items = cart.items.map((item: any) => {
      const product = db.products.find((p: any) => p.id === item.productId);
      return {
        ...item,
        product: product
      };
    });

    // Total amount hesapla
    cart.totalAmount = cart.items.reduce((total: number, item: any) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { data: cart }
    } as ResponseOptions));
  }

  private handleGetProducts(reqInfo: RequestInfo) {
    const db = reqInfo.utils.getDb() as any;
    const params = reqInfo.req.url.split('?')[1];
    const urlParams = new URLSearchParams(params || '');
    
    let products = [...db.products];
    
    // Search filtresi
    const search = urlParams.get('search');
    if (search) {
      products = products.filter((p: Product) => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filtresi
    const category = urlParams.get('category');
    if (category) {
      products = products.filter((p: Product) => p.category === category);
    }

    // Pagination
    const page = parseInt(urlParams.get('page') || '0');
    const size = parseInt(urlParams.get('size') || '12');
    const total = products.length;
    const totalPages = Math.ceil(total / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    products = products.slice(startIndex, endIndex);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: {
        data: products,
        total: total,
        page: page,
        size: size,
        totalPages: totalPages
      }
    } as ResponseOptions));
  }

  private handleGetCategories(reqInfo: RequestInfo) {
    const db = reqInfo.utils.getDb() as any;
    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { data: db.categories }
    } as ResponseOptions));
  }

  private handleGetOrders(reqInfo: RequestInfo) {
    const db = reqInfo.utils.getDb() as any;
    const url = reqInfo.req.url;
    
    // Single order by ID
    const orderIdMatch = url.match(/\/api\/v1\/orders\/([^/?]+)$/);
    if (orderIdMatch) {
      const orderId = orderIdMatch[1];
      const order = db.orders.find((o: Order) => o.id === orderId);
      
      if (!order) {
        return reqInfo.utils.createResponse$(() => ({
          status: 404,
          body: { error: 'Order not found' }
        } as ResponseOptions));
      }
      
      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: { data: order }
      } as ResponseOptions));
    }

    // Orders list with pagination
    const params = url.split('?')[1];
    const urlParams = new URLSearchParams(params || '');
    
    let orders = [...db.orders];
    
    // Status filtresi
    const status = urlParams.get('status');
    if (status) {
      orders = orders.filter((o: Order) => o.status === status);
    }

    // Pagination
    const page = parseInt(urlParams.get('page') || '0');
    const size = parseInt(urlParams.get('size') || '10');
    const total = orders.length;
    const totalPages = Math.ceil(total / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    orders = orders.slice(startIndex, endIndex);

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: {
        data: orders,
        total: total,
        page: page,
        size: size,
        totalPages: totalPages
      }
    } as ResponseOptions));
  }

  private handleAddToCart(reqInfo: RequestInfo) {
    const body = reqInfo.utils.getJsonBody(reqInfo.req) as { productId: string; quantity: number };
    const db = reqInfo.utils.getDb() as any;
    const cart = db.cart[0];
    const product = db.products.find((p: Product) => p.id === body.productId);
    
    if (!product) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Product not found' }
      } as ResponseOptions));
    }

    const quantity = Math.max(1, Number(body.quantity || 1));
    const existingItem = cart.items.find((item: any) => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: uuid(),
        productId: product.id,
        product: product,
        quantity: quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price
      });
    }

    cart.updatedAt = new Date().toISOString();

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      body: { data: cart.items.find((item: any) => item.productId === product.id) }
    } as ResponseOptions));
  }

  private handleUpdateCartItem(reqInfo: RequestInfo) {
    const itemId = reqInfo.req.url.split('/').pop();
    const body = reqInfo.utils.getJsonBody(reqInfo.req) as { quantity: number };
    const db = reqInfo.utils.getDb() as any;
    const cart = db.cart[0];
    
    const item = cart.items.find((item: any) => item.id === itemId);
    if (!item) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Cart item not found' }
      } as ResponseOptions));
    }

    item.quantity = Math.max(1, Number(body.quantity || 1));
    item.totalPrice = item.quantity * item.unitPrice;
    cart.updatedAt = new Date().toISOString();

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { data: item }
    } as ResponseOptions));
  }

  private handleRemoveCartItem(reqInfo: RequestInfo) {
    const itemId = reqInfo.req.url.split('/').pop();
    const db = reqInfo.utils.getDb() as any;
    const cart = db.cart[0];
    
    const itemIndex = cart.items.findIndex((item: any) => item.id === itemId);
    if (itemIndex === -1) {
      return reqInfo.utils.createResponse$(() => ({
        status: 404,
        body: { error: 'Cart item not found' }
      } as ResponseOptions));
    }

    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date().toISOString();

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { data: null }
    } as ResponseOptions));
  }

  private handleClearCart(reqInfo: RequestInfo) {
    const db = reqInfo.utils.getDb() as any;
    const cart = db.cart[0];
    
    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = new Date().toISOString();

    return reqInfo.utils.createResponse$(() => ({
      status: 200,
      body: { data: null }
    } as ResponseOptions));
  }

  private handleCheckout(reqInfo: RequestInfo) {
    const body = reqInfo.utils.getJsonBody(reqInfo.req) as { shippingAddress: ShippingAddress };
    const db = reqInfo.utils.getDb() as any;
    const cart = db.cart[0];
    
    if (!cart.items.length) {
      return reqInfo.utils.createResponse$(() => ({
        status: 400,
        body: { error: 'Cart is empty' }
      } as ResponseOptions));
    }

    // Order items oluştur
    const orderItems: OrderItem[] = cart.items.map((cartItem: any) => {
      const product = db.products.find((p: Product) => p.id === cartItem.productId);
      
      // Stok kontrolü ve azaltma
      if (product) {
        product.stock = Math.max(0, product.stock - cartItem.quantity);
      }

      return {
        id: uuid(),
        productId: cartItem.productId,
        productName: product?.name || 'Unknown Product',
        productImageUrl: product?.imageUrl || '',
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        totalPrice: cartItem.quantity * cartItem.unitPrice
      };
    });

    const totalAmount = orderItems.reduce((total, item) => total + item.totalPrice, 0);

    // Yeni sipariş oluştur
    const order: Order = {
      id: uuid(),
      userId: 'current-user',
      items: orderItems,
      shippingAddress: body.shippingAddress,
      totalAmount: totalAmount,
      status: OrderStatus.CREATED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders.push(order);

    // Sepeti temizle
    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = new Date().toISOString();

    return reqInfo.utils.createResponse$(() => ({
      status: 201,
      body: { data: order }
    } as ResponseOptions));
  }
}
