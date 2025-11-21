# 📊 Tinder AI Platform - Візуальна IR Діаграма

## 🗄️ Database Schema & Relations

```mermaid
erDiagram
    USERS ||--o{ CONTENT : creates
    USERS ||--o{ RATINGS : submits
    USERS ||--|| USER_INSIGHTS : has
    PROMPT_TEMPLATES ||--o{ CONTENT : uses
    CONTENT ||--o{ RATINGS : receives
    CONTENT ||--o{ CONTENT : variations
    
    USERS {
        uuid id PK
        text username UK
        text email UK
        text password_hash
        text role
        boolean is_active
        timestamp created_at
    }
    
    PROMPT_TEMPLATES {
        uuid id PK
        text name UK
        text category
        text base_prompt
        text system_instructions
        jsonb insights_json
        integer total_uses
        float avg_like_rate
        timestamp created_at
    }
    
    CONTENT {
        uuid id PK
        uuid template_id FK
        uuid user_id FK
        uuid parent_id FK
        text url
        text media_type
        text original_prompt
        text enhanced_prompt
        text final_prompt
        text model
        jsonb meta_json
        integer total_ratings
        integer likes_count
        integer dislikes_count
        float like_rate
        timestamp created_at
    }
    
    RATINGS {
        uuid id PK
        uuid content_id FK
        uuid user_id FK
        text direction
        text comment
        integer latency_ms
        jsonb meta_json
        timestamp created_at
    }
    
    USER_INSIGHTS {
        uuid user_id PK
        jsonb likes_json
        jsonb dislikes_json
        jsonb preferences_json
        integer total_swipes
        integer total_likes
        integer total_dislikes
        timestamp updated_at
    }
```

---

## 🔄 Content Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant OpenAI
    participant Replicate
    participant Database
    
    User->>Frontend: Вводить промпт
    Frontend->>Backend: POST /api/content/generate
    
    rect rgb(200, 220, 255)
        Note over Backend,OpenAI: 1. Category Detection
        Backend->>OpenAI: detectCategory(prompt)
        OpenAI-->>Backend: category="dating"
    end
    
    rect rgb(255, 220, 200)
        Note over Backend,Database: 2. Fetch User Insights
        Backend->>Database: getUserInsights(userId)
        Database-->>Backend: {likes: [], dislikes: []}
    end
    
    rect rgb(200, 255, 220)
        Note over Backend,OpenAI: 3. Enhance Prompt
        Backend->>OpenAI: enhancePrompt(prompt, insights)
        OpenAI-->>Backend: enhancedPrompt
    end
    
    rect rgb(255, 255, 200)
        Note over Backend,Replicate: 4. Generate Content
        Backend->>Replicate: generateImage(enhancedPrompt)
        Note over Replicate: ~30-60 секунд
        Replicate-->>Backend: imageURL
    end
    
    rect rgb(220, 200, 255)
        Note over Backend,Database: 5. Save to DB
        Backend->>Database: INSERT INTO content
        Database-->>Backend: contentId
    end
    
    Backend-->>Frontend: {content: {...}}
    Frontend-->>User: Показує фото
```

---

## 🔄 Rating & Insights Update Flow

```mermaid
flowchart TD
    Start([User Swipes]) --> Rating[Create Rating]
    Rating --> DB[(Save to ratings table)]
    DB --> Trigger{Database Trigger}
    
    Trigger --> UpdateStats[Update content stats<br/>likes_count++<br/>like_rate recalculate]
    
    UpdateStats --> Check{Every 10th<br/>rating?}
    
    Check -->|No| End1([End])
    Check -->|Yes| Fetch[Fetch last 50 ratings]
    
    Fetch --> Filter[Filter: Only with comments!]
    Filter --> Separate[Separate likes/dislikes]
    
    Separate --> Analyze1[OpenAI: Analyze LIKE comments]
    Separate --> Analyze2[OpenAI: Analyze DISLIKE comments]
    
    Analyze1 --> Extract1[Extract keywords]
    Analyze2 --> Extract2[Extract keywords]
    
    Extract1 --> Count[Count frequency]
    Extract2 --> Count
    
    Count --> Upsert[Upsert to user_insights]
    Upsert --> End2([Insights Updated!])
    
    style Filter fill:#ff6b6b
    style Analyze1 fill:#4ecdc4
    style Analyze2 fill:#4ecdc4
    style Upsert fill:#95e1d3
```

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Frontend["🌐 FRONTEND (React)"]
        UI[User Interface]
        API_Client[Axios API Client]
    end
    
    subgraph Backend["⚙️ BACKEND (Express.js)"]
        Routes[API Routes]
        Services[Business Logic]
        Middleware[Auth & Logging]
    end
    
    subgraph Database["🗄️ DATABASE (Supabase)"]
        Users[(users)]
        Templates[(prompt_templates)]
        Content[(content)]
        Ratings[(ratings)]
        Insights[(user_insights)]
    end
    
    subgraph AI["🧠 AI SERVICES"]
        OpenAI[OpenAI<br/>GPT-4o/GPT-4o-mini]
        Replicate[Replicate<br/>ByteDance Seedream-4]
    end
    
    subgraph Storage["💾 STORAGE"]
        Blob[Vercel Blob Storage]
        CDN[Replicate CDN]
    end
    
    UI --> API_Client
    API_Client <-->|HTTP REST| Routes
    Routes --> Middleware
    Middleware --> Services
    
    Services <--> Users
    Services <--> Templates
    Services <--> Content
    Services <--> Ratings
    Services <--> Insights
    
    Services <-->|Category Detection<br/>Prompt Enhancement<br/>Comment Analysis| OpenAI
    Services <-->|Image Generation| Replicate
    
    Services --> Blob
    Replicate --> CDN
    
    style Frontend fill:#e3f2fd
    style Backend fill:#fff3e0
    style Database fill:#f3e5f5
    style AI fill:#e8f5e9
    style Storage fill:#fce4ec
```

---

## 📡 API Endpoints Map

```mermaid
graph LR
    API[/api] --> Health[/health<br/>GET]
    
    API --> Auth[/auth]
    Auth --> Register[/register<br/>POST]
    Auth --> Login[/login<br/>POST]
    Auth --> Me[/me<br/>GET]
    
    API --> Content[/content]
    Content --> Generate[/generate<br/>POST]
    Content --> GetContent[/:id<br/>GET]
    Content --> ListContent[/<br/>GET]
    Content --> Random[/random/next<br/>GET]
    
    API --> Ratings[/ratings]
    Ratings --> CreateRating[/<br/>POST]
    Ratings --> ListRatings[/<br/>GET]
    Ratings --> Stats[/stats<br/>GET]
    
    API --> Insights[/insights]
    Insights --> UserInsights[/user/:userId<br/>GET]
    Insights --> UpdateUser[/user/:userId/update<br/>POST]
    Insights --> TemplateInsights[/template/:id<br/>GET]
    Insights --> Dashboard[/dashboard<br/>GET]
    
    API --> Admin[/admin]
    Admin --> Templates[/templates<br/>GET/POST]
    Admin --> TemplateById[/templates/:id<br/>GET/PUT/DELETE]
    
    style API fill:#1976d2,color:#fff
    style Auth fill:#f57c00,color:#fff
    style Content fill:#388e3c,color:#fff
    style Ratings fill:#7b1fa2,color:#fff
    style Insights fill:#c62828,color:#fff
    style Admin fill:#455a64,color:#fff
```

---

## 🔄 Data Flow: Prompt Enhancement with Insights

```mermaid
graph TB
    Start([User Prompt]) --> Category{Category<br/>Detection}
    
    Category -->|dating| Dating[Dating System Prompt]
    Category -->|other| General[General System Prompt]
    
    Dating --> Insights{User has<br/>insights?}
    General --> Insights
    
    Insights -->|Yes| Fetch[Fetch user_insights]
    Insights -->|No| NoInsights[Use template insights only]
    
    Fetch --> Likes[likes_json:<br/>посмішка, волося, поза]
    Fetch --> Dislikes[dislikes_json:<br/>рижих, лінзи]
    
    Likes --> Merge[Merge with template insights]
    Dislikes --> Merge
    NoInsights --> Merge
    
    Merge --> Build[Build Context]
    Build --> Enhance[OpenAI enhancePrompt]
    
    Enhance --> Output[Enhanced Prompt:<br/>Young woman, brunette hair,<br/>natural smile, beach...]
    
    Output --> Generate[Replicate generateImage]
    Generate --> Result([Generated Image])
    
    style Start fill:#90caf9
    style Insights fill:#ffb74d
    style Likes fill:#81c784
    style Dislikes fill:#e57373
    style Enhance fill:#ba68c8
    style Result fill:#4db6ac
```

---

## ⚠️ Current Problem: Comment-Only Insights

```mermaid
graph LR
    subgraph All_Ratings["👤 User Ratings (36 total)"]
        R1[Rating 1<br/>✅ comment]
        R2[Rating 2<br/>❌ no comment]
        R3[Rating 3<br/>✅ comment]
        R4[Rating 4<br/>❌ no comment]
        R5[Rating 5<br/>❌ no comment]
        More[... 31 more]
    end
    
    subgraph Filter["🔍 Filter Process"]
        OnlyComments[".filter(r => r.comment)"]
    end
    
    subgraph Analyzed["📊 Analyzed (11 only)"]
        C1[Comment 1]
        C2[Comment 2]
        C3[Comment 3]
        More2[... 8 more]
    end
    
    subgraph Lost["❌ Lost Data (25)"]
        L1[Silent like]
        L2[Silent like]
        L3[Silent dislike]
        More3[... 22 more]
    end
    
    R1 --> OnlyComments
    R2 -.X.-> Lost
    R3 --> OnlyComments
    R4 -.X.-> Lost
    R5 -.X.-> Lost
    
    OnlyComments --> C1
    OnlyComments --> C2
    OnlyComments --> C3
    
    C1 --> OpenAI[OpenAI Analysis]
    C2 --> OpenAI
    C3 --> OpenAI
    
    OpenAI --> Insights[(user_insights<br/>Based on 30% data!)]
    
    style Filter fill:#ff6b6b,color:#fff
    style Lost fill:#757575,color:#fff
    style Analyzed fill:#4caf50,color:#fff
    style Insights fill:#ff9800,color:#fff
```

---

## 💡 Proposed Solution: Hybrid Approach

```mermaid
graph TB
    Ratings[User Ratings] --> Split{Has<br/>comment?}
    
    Split -->|Yes| Comments[Comments Path]
    Split -->|No| Silent[Silent Ratings Path]
    
    Comments --> OpenAI1[OpenAI<br/>Comment Analysis]
    OpenAI1 --> Keywords1[Extract Keywords]
    
    Silent --> Top10{Top 10<br/>most liked<br/>content?}
    Top10 -->|Yes| Vision[OpenAI<br/>Vision API]
    Top10 -->|No| Skip[Skip]
    
    Vision --> Analyze[Analyze Image:<br/>What's good/bad?]
    Analyze --> Keywords2[Auto Keywords]
    
    Keywords1 --> Merge[Merge All Keywords]
    Keywords2 --> Merge
    
    Merge --> Weight[Apply Weights:<br/>Comments = 1.0<br/>Vision = 0.7]
    
    Weight --> FinalInsights[(Final Insights<br/>Based on 100% data!)]
    
    style Comments fill:#4caf50,color:#fff
    style Silent fill:#ff9800,color:#fff
    style Vision fill:#2196f3,color:#fff
    style FinalInsights fill:#9c27b0,color:#fff
```

---

## 📊 Performance & Cost

```mermaid
graph LR
    subgraph Generation["🎨 Content Generation"]
        G1[Category: 1.2s<br/>$0.0001]
        G2[Enhancement: 3.6s<br/>$0.003]
        G3[AI Gen: 40s<br/>$0.03]
        Total1[Total: 45s<br/>$0.033]
        
        G1 --> G2 --> G3 --> Total1
    end
    
    subgraph Rating["⭐ Rating Submit"]
        R1[Validation: 0.05s]
        R2[Save: 0.15s]
        R3[Trigger: 0.1s]
        Total2[Total: 0.3s<br/>Free]
        
        R1 --> R2 --> R3 --> Total2
    end
    
    subgraph Insights["🧠 Insights Update"]
        I1[Fetch: 0.2s]
        I2[OpenAI x2: 4s<br/>$0.0006]
        I3[Save: 0.15s]
        Total3[Total: 4.5s<br/>$0.0006]
        
        I1 --> I2 --> I3 --> Total3
    end
    
    style Total1 fill:#e57373,color:#fff
    style Total2 fill:#81c784,color:#fff
    style Total3 fill:#64b5f6,color:#fff
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    rect rgb(200, 220, 255)
        Note over User,Database: Registration
        User->>Frontend: Enter credentials
        Frontend->>Backend: POST /api/auth/register
        Backend->>Backend: Validate & Hash password (bcrypt)
        Backend->>Database: INSERT INTO users
        Database-->>Backend: user_id
        Backend->>Backend: Generate JWT token
        Backend-->>Frontend: {token, user}
        Frontend->>Frontend: Store token
        Frontend-->>User: Success!
    end
    
    rect rgb(255, 220, 200)
        Note over User,Database: Login
        User->>Frontend: Enter credentials
        Frontend->>Backend: POST /api/auth/login
        Backend->>Database: SELECT user
        Database-->>Backend: user data
        Backend->>Backend: Compare password hash
        Backend->>Backend: Generate JWT token
        Backend->>Database: UPDATE last_login_at
        Backend-->>Frontend: {token, user}
        Frontend->>Frontend: Store token
        Frontend-->>User: Success!
    end
    
    rect rgb(200, 255, 220)
        Note over User,Database: Protected Request
        User->>Frontend: Request data
        Frontend->>Backend: GET /api/content<br/>Authorization: Bearer {token}
        Backend->>Backend: Verify JWT token
        Backend->>Database: Query data
        Database-->>Backend: Results
        Backend-->>Frontend: {data}
        Frontend-->>User: Display data
    end
```

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph GitHub["📦 GitHub Repository"]
        Code[Source Code]
        Actions[GitHub Actions]
    end
    
    subgraph Vercel["☁️ Vercel Platform"]
        Build[Build Process]
        
        subgraph Frontend_Deploy["Frontend"]
            Static[Static Files<br/>React Build]
            CDN_V[Vercel CDN]
        end
        
        subgraph Backend_Deploy["Backend"]
            Lambda[Serverless Functions<br/>AWS Lambda]
            API_Route[/api/* routes]
        end
        
        Blob[Blob Storage]
    end
    
    subgraph External["🌐 External Services"]
        Supabase[(Supabase<br/>PostgreSQL)]
        OpenAI_API[OpenAI API]
        Replicate_API[Replicate API]
        Replicate_CDN[Replicate CDN]
    end
    
    Code --> Actions
    Actions --> Build
    
    Build --> Static
    Build --> Lambda
    
    Static --> CDN_V
    Lambda --> API_Route
    
    API_Route <--> Supabase
    API_Route <--> OpenAI_API
    API_Route <--> Replicate_API
    API_Route --> Blob
    
    Replicate_API --> Replicate_CDN
    
    Users[👥 Users] --> CDN_V
    Users --> API_Route
    
    style GitHub fill:#24292e,color:#fff
    style Vercel fill:#000,color:#fff
    style External fill:#1976d2,color:#fff
```

---

## 📈 Insights Accumulation Over Time

```mermaid
graph LR
    subgraph T0["Initial State"]
        I0[No insights]
    end
    
    subgraph T1["After 10 ratings"]
        I1[3 keywords<br/>low confidence]
    end
    
    subgraph T2["After 30 ratings"]
        I2[8 keywords<br/>medium confidence]
    end
    
    subgraph T3["After 50+ ratings"]
        I3[15+ keywords<br/>high confidence]
    end
    
    I0 -->|10 swipes| I1
    I1 -->|20 more| I2
    I2 -->|20 more| I3
    
    I1 -.->|influences| Gen1[Generation<br/>slightly better]
    I2 -.->|influences| Gen2[Generation<br/>much better]
    I3 -.->|influences| Gen3[Generation<br/>personalized!]
    
    style I0 fill:#e0e0e0
    style I1 fill:#fff59d
    style I2 fill:#ffb74d
    style I3 fill:#66bb6a
```

---

## 🎯 Key Metrics Dashboard

```mermaid
graph TB
    subgraph Metrics["📊 System Metrics"]
        M1[Total Content<br/>Generated]
        M2[Total Ratings<br/>Submitted]
        M3[Average Like Rate<br/>Percentage]
        M4[Active Users<br/>Count]
    end
    
    subgraph User_Metrics["👤 User Metrics"]
        U1[Total Swipes]
        U2[Likes / Dislikes<br/>Ratio]
        U3[Insights Keywords<br/>Count]
        U4[Favorite Templates]
    end
    
    subgraph AI_Metrics["🧠 AI Performance"]
        A1[Avg Generation Time<br/>seconds]
        A2[Success Rate<br/>percentage]
        A3[Token Usage<br/>per generation]
        A4[Cost per User<br/>dollars]
    end
    
    Dashboard[📈 Dashboard] --> Metrics
    Dashboard --> User_Metrics
    Dashboard --> AI_Metrics
    
    style Dashboard fill:#1976d2,color:#fff
    style Metrics fill:#4caf50,color:#fff
    style User_Metrics fill:#ff9800,color:#fff
    style AI_Metrics fill:#9c27b0,color:#fff
```

---

## 🔧 Technologies Stack

```mermaid
mindmap
  root((Tinder AI<br/>Platform))
    Frontend
      React 18
      Axios
      React Router
      CSS Modules
    Backend
      Node.js 18
      Express.js
      JWT Auth
      bcrypt
    Database
      PostgreSQL 15
      Supabase
      JSONB columns
      Triggers
    AI Services
      OpenAI
        GPT-4o
        GPT-4o-mini
        Vision API future
      Replicate
        Seedream-4
        SDXL
    Storage
      Vercel Blob
      Replicate CDN
    Deployment
      Vercel
      GitHub
      Serverless
```

---

## 📝 Quick Reference

### Timing
- **Generation**: 35-40 seconds
- **Rating**: 0.3 seconds  
- **Insights Update**: 4.5 seconds

### Cost per 1000 Generations
- **OpenAI**: $3.29
- **Replicate**: $30.00
- **Storage**: $0.30
- **Total**: ~$33.60

### Key Problem
⚠️ **Only 30% of ratings analyzed** (those with comments)

### Recommended Solution
🎯 **Hybrid Approach**: Comments (priority) + Vision API (top-10 fallback)

---

**Version:** 1.0  
**Date:** 2025-11-21  
**Format:** Mermaid Diagrams (render on GitHub or use Mermaid viewer)

