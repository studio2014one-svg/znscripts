# ZnScripts - Site de Scripts e Executores para Roblox

## 📁 Estrutura do Projeto

```
znscripts/
├── index.html          # Página inicial
├── scripts.html        # Página de scripts
├── executors.html      # Página de executores
├── admin.html          # Painel administrativo
├── css/
│   ├── style.css       # Estilos principais
│   ├── components.css  # Componentes (botões, cards, modals)
│   ├── animations.css  # Animações
│   └── admin.css       # Estilos do painel admin
└── js/
    ├── data.js         # Sistema de banco de dados (localStorage)
    ├── auth.js         # Sistema de autenticação
    ├── main.js         # JavaScript principal
    ├── scripts-page.js # Página de scripts
    ├── executors-page.js # Página de executores
    └── admin.js        # Painel administrativo
```

## 🚀 Como Usar

### Hospedagem Local
1. Baixe todos os arquivos
2. Abra o arquivo `index.html` no navegador
3. O site funcionará completamente offline usando localStorage

### Hospedagem Online
Você pode hospedar gratuitamente em:
- **GitHub Pages** (github.com)
- **Netlify** (netlify.com)
- **Vercel** (vercel.com)
- **InfinityFree** (infinityfree.net)

## 🔐 Credenciais de Administrador

**Acesso ao painel admin:**
- **URL:** admin.html
- **Usuário:** `admin`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro acesso!

## ✨ Funcionalidades

### Para Usuários
- ✅ Visualizar scripts e executores
- ✅ Copiar scripts com um clique
- ✅ Baixar executores diretamente
- ✅ Buscar e filtrar conteúdo
- ✅ Criar conta e fazer login
- ✅ Design responsivo (mobile-friendly)

### Para Administradores
- ✅ Adicionar, editar e remover scripts
- ✅ Adicionar, editar e remover executores
- ✅ Upload de imagens (URL ou arquivo)
- ✅ Gerenciar usuários
- ✅ Alterar senhas
- ✅ Dashboard com estatísticas
- ✅ Controle total do site

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `css/style.css`:
```css
:root {
    --color-primary: #ff0a0a;      /* Cor principal (vermelho) */
    --color-bg: #0a0a0a;           /* Fundo (preto) */
    /* ... */
}
```

### Logo e Nome
Edite diretamente nos arquivos HTML a tag `.logo`:
```html
<span class="logo-text">Zn<span class="accent">Scripts</span></span>
```

## 📝 Notas Importantes

1. **Dados são salvos no navegador** - Este site usa localStorage, então os dados ficam salvos apenas no navegador local. Se quiser um sistema com banco de dados real, precisará de um backend.

2. **Imagens** - Você pode usar URLs de imagens ou fazer upload (converte para base64). Para muitas imagens, recomendo usar URLs do Imgur ou Discord.

3. **Segurança** - Este é um projeto demonstrativo. Para uso em produção, implemente:
   - Backend com autenticação real
   - Banco de dados (MySQL, MongoDB, etc.)
   - HTTPS obrigatório
   - Validação de inputs no servidor

## 🛠️ Suporte

Criado por **Zn_Atxug**

---

Aproveite o site! 🎮
