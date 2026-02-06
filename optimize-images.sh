#!/bin/bash

# Script de otimização de imagens
# Converte para WebP e otimiza PNGs originais

PROJECT_DIR="/root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16"
PUBLIC_DIR="$PROJECT_DIR/public"
BACKUP_DIR="$PROJECT_DIR/public/originals-backup"

echo "🖼️  Iniciando otimização de imagens..."

# Criar diretório de backup
mkdir -p "$BACKUP_DIR"

# Função para otimizar uma imagem
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local dir=$(dirname "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"

    echo ""
    echo "📸 Processando: $filename"

    # Tamanho original
    local original_size=$(du -h "$file" | cut -f1)
    echo "   Tamanho original: $original_size"

    # Backup do original
    if [ ! -f "$BACKUP_DIR/$filename" ]; then
        cp "$file" "$BACKUP_DIR/$filename"
        echo "   ✓ Backup criado"
    fi

    # Converter para WebP (qualidade 85, muito boa para web)
    local webp_file="$dir/$name.webp"
    cwebp -q 85 "$file" -o "$webp_file" > /dev/null 2>&1

    if [ -f "$webp_file" ]; then
        local webp_size=$(du -h "$webp_file" | cut -f1)
        echo "   ✓ WebP criado: $webp_size"
    fi

    # Otimizar PNG original com pngquant (qualidade 80-95)
    if [ "$ext" = "png" ]; then
        pngquant --quality=80-95 --force --ext .png "$file" > /dev/null 2>&1
        local optimized_size=$(du -h "$file" | cut -f1)
        echo "   ✓ PNG otimizado: $optimized_size"
    fi
}

# Otimizar hero images (crítico - landing page)
echo ""
echo "=== HERO IMAGES (Crítico) ==="
[ -f "$PUBLIC_DIR/hero-desktop.png" ] && optimize_image "$PUBLIC_DIR/hero-desktop.png"
[ -f "$PUBLIC_DIR/hero-mobile.png" ] && optimize_image "$PUBLIC_DIR/hero-mobile.png"

# Otimizar portfolio images
echo ""
echo "=== PORTFOLIO IMAGES ==="
for img in "$PUBLIC_DIR/portfolio"/*.png; do
    [ -f "$img" ] && optimize_image "$img"
done

# Otimizar screenshots
echo ""
echo "=== SCREENSHOT IMAGES ==="
for img in "$PUBLIC_DIR/screenshots"/*.png; do
    [ -f "$img" ] && optimize_image "$img"
done

# Otimizar logos (manter PNG de alta qualidade para transparência)
echo ""
echo "=== LOGO IMAGES ==="
for img in "$PUBLIC_DIR"/*.png; do
    case "$img" in
        *logo*.png|*favicon*.png)
            optimize_image "$img"
            ;;
    esac
done

echo ""
echo "✅ Otimização concluída!"
echo ""
echo "📊 Estatísticas:"
echo "   Backups salvos em: $BACKUP_DIR"
echo "   Arquivos WebP criados em: cada diretório respectivo"
echo ""
echo "💡 Próximo passo: Atualizar código para usar <picture> com WebP + PNG fallback"
