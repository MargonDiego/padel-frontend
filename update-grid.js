const fs = require('fs');
const path = require('path');

// Función para buscar archivos recursivamente
function findFiles(dir, pattern) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Función para actualizar el contenido de un archivo
function updateFile(filePath) {
  console.log(`Procesando: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar <Grid item xs={X}> por <Grid size={X}>
  content = content.replace(/<Grid\s+item\s+xs=\{([^}]+)\}([^>]*)>/g, '<Grid size={$1}$2>');
  
  // Reemplazar <Grid item xs={X} sm={Y}> por <Grid size={{ xs: X, sm: Y }}>
  content = content.replace(/<Grid\s+item\s+xs=\{([^}]+)\}\s+sm=\{([^}]+)\}([^>]*)>/g, '<Grid size={{ xs: $1, sm: $2 }}$3>');
  
  // Reemplazar <Grid item xs={X} md={Y}> por <Grid size={{ xs: X, md: Y }}>
  content = content.replace(/<Grid\s+item\s+xs=\{([^}]+)\}\s+md=\{([^}]+)\}([^>]*)>/g, '<Grid size={{ xs: $1, md: $2 }}$3>');
  
  // Reemplazar <Grid item xs={X} sm={Y} md={Z}> por <Grid size={{ xs: X, sm: Y, md: Z }}>
  content = content.replace(/<Grid\s+item\s+xs=\{([^}]+)\}\s+sm=\{([^}]+)\}\s+md=\{([^}]+)\}([^>]*)>/g, '<Grid size={{ xs: $1, sm: $2, md: $3 }}$4>');
  
  // Guardar el archivo actualizado
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Actualizado: ${filePath}`);
}

// Directorio principal
const srcDir = path.join(__dirname, 'src');

// Buscar archivos .tsx
const tsxFiles = findFiles(srcDir, /\.(tsx|jsx)$/);

// Actualizar cada archivo
for (const file of tsxFiles) {
  updateFile(file);
}

console.log('¡Actualización completada!');
