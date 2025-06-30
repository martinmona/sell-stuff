import { executeQuery } from "./db"

export type Product = {
  id: number
  name: string
  description: string
  price: number
  mainImage?: string
  images?: string[]
  reserved: boolean // Nuevo campo
}

// Obtener todos los productos con su imagen principal
export async function getProducts(): Promise<Product[]> {
  // Añadir un timestamp a la consulta para evitar la caché
  const timestamp = new Date().getTime()

  const products = await executeQuery(`
    SELECT p.*, i.url as main_image 
    FROM products p
    LEFT JOIN images i ON p.id = i.product_id AND i.is_main = true
    ORDER BY p.created_at DESC
    -- Añadir comentario con timestamp: ${timestamp}
  `)

  return products.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number.parseFloat(product.price),
    reserved: product.reserved || false, // Incluir el campo reserved
    // Añadir timestamp a la URL para evitar la caché de imágenes
    mainImage: product.main_image
      ? `${product.main_image}?t=${timestamp}`
      : `/generic-product-display.png?t=${timestamp}`,
  }))
}

// Obtener un producto por ID con todas sus imágenes
export async function getProductById(id: number): Promise<Product | null> {
  // Añadir un timestamp para evitar la caché
  const timestamp = new Date().getTime()

  const products = await executeQuery(
    `
    SELECT p.* FROM products p WHERE p.id = $1
    -- Añadir comentario con timestamp: ${timestamp}
  `,
    [id],
  )

  if (products.length === 0) return null

  const product = products[0]

  // Obtener todas las imágenes del producto
  const images = await executeQuery(
    `
    SELECT url, is_main FROM images WHERE product_id = $1 ORDER BY is_main DESC
    -- Añadir comentario con timestamp: ${timestamp}
  `,
    [id],
  )

  // Añadir timestamp a las URLs para evitar la caché
  const imageUrls = images.map((img: any) => `${img.url}?t=${timestamp}`)

  // Encontrar la imagen principal o usar la primera imagen disponible
  const mainImage =
    images.find((img: any) => img.is_main)?.url || (images.length > 0 ? images[0].url : "/generic-product-display.png")

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number.parseFloat(product.price),
    reserved: product.reserved || false, // Incluir el campo reserved
    mainImage: `${mainImage}?t=${timestamp}`,
    images: imageUrls,
  }
}

// Crear un nuevo producto
export async function createProduct(product: Omit<Product, "id">) {
  const result = await executeQuery(
    `
    INSERT INTO products (name, description, price, reserved)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `,
    [product.name, product.description, product.price, product.reserved || false],
  )

  return result[0].id
}

// Actualizar un producto existente
export async function updateProduct(id: number, product: Partial<Product>) {
  await executeQuery(
    `
    UPDATE products
    SET name = $1, description = $2, price = $3, reserved = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
  `,
    [product.name, product.description, product.price, product.reserved || false, id],
  )
}

// Actualizar solo el estado de reserva de un producto
export async function updateProductReservation(id: number, reserved: boolean) {
  await executeQuery(
    `
    UPDATE products
    SET reserved = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `,
    [reserved, id],
  )
}

// Eliminar un producto
export async function deleteProduct(id: number) {
  await executeQuery(`DELETE FROM products WHERE id = $1`, [id])
}

// Añadir una imagen a un producto
export async function addProductImage(productId: number, imageUrl: string, isMain = false) {
  // Si es la imagen principal, actualizar las demás a no principales
  if (isMain) {
    await executeQuery(
      `
      UPDATE images SET is_main = false WHERE product_id = $1
    `,
      [productId],
    )
  }

  await executeQuery(
    `
    INSERT INTO images (product_id, url, is_main)
    VALUES ($1, $2, $3)
  `,
    [productId, imageUrl, isMain],
  )
}

// Eliminar una imagen
export async function deleteProductImage(imageId: number) {
  await executeQuery(`DELETE FROM images WHERE id = $1`, [imageId])
}
