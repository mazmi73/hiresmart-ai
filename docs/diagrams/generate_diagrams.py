import os
import zlib
import requests

DIAGRAMS_DIR = os.path.abspath(r"c:\Users\J_jolam\Downloads\HireSmart AI\docs\diagrams")
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

def encode_plantuml(text):
    zlib_comp = zlib.compressobj(9, zlib.DEFLATED, -15)
    compressed = zlib_comp.compress(text.encode('utf-8')) + zlib_comp.flush()
    mapping = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
    res = []
    for i in range(0, len(compressed), 3):
        b1 = compressed[i]
        b2 = compressed[i+1] if i+1 < len(compressed) else 0
        b3 = compressed[i+2] if i+2 < len(compressed) else 0
        res.append(mapping[b1 >> 2])
        res.append(mapping[((b1 & 0x3) << 4) | (b2 >> 4)])
        res.append(mapping[((b2 & 0xF) << 2) | (b3 >> 6)])
        res.append(mapping[b3 & 0x3F])
    return ''.join(res)

def download_diagram(name, puml_code):
    print(f"Generating diagram: {name}...")
    enc = encode_plantuml(puml_code)
    
    # Save .puml source
    puml_path = os.path.join(DIAGRAMS_DIR, f"{name}.puml")
    with open(puml_path, "w", encoding="utf-8") as f:
        f.write(puml_code)
        
    # Download PNG
    png_url = f"http://www.plantuml.com/plantuml/png/~1{enc}"
    r_png = requests.get(png_url, timeout=30)
    if r_png.status_code == 200:
        png_path = os.path.join(DIAGRAMS_DIR, f"{name}.png")
        with open(png_path, "wb") as f:
            f.write(r_png.content)
        print(f"  [OK] Saved PNG: {png_path} ({len(r_png.content)} bytes)")
    else:
        print(f"  [ERROR] PNG failed with status {r_png.status_code}")

    # Download SVG
    svg_url = f"http://www.plantuml.com/plantuml/svg/~1{enc}"
    r_svg = requests.get(svg_url, timeout=30)
    if r_svg.status_code == 200:
        svg_path = os.path.join(DIAGRAMS_DIR, f"{name}.svg")
        with open(svg_path, "wb") as f:
            f.write(r_svg.content)
        print(f"  [OK] Saved SVG: {svg_path} ({len(r_svg.content)} bytes)")
    else:
        print(f"  [ERROR] SVG failed with status {r_svg.status_code}")


# 1. Use Case Diagram
USE_CASE_PUML = """@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing true
skinparam roundcorner 10
skinparam actorStyle awesome

skinparam usecase {
    BackgroundColor #FFFFFF
    BorderColor #2B6CB0
    ArrowColor #2D3748
}

skinparam actor {
    BackgroundColor #EDF2F7
    BorderColor #2B6CB0
}

actor "Candidat" as Candidat #4299E1
actor "Recruteur" as Recruteur #ED8936
actor "Administrateur" as Admin #805AD5
actor "Moteur IA / LLM\\n(Service Externe)" as MoteurIA #48BB78

rectangle "Plateforme HireSmart AI" {

    package "Authentification & Sécurité" {
        usecase "S'authentifier (JWT)" as UC_Auth
        usecase "Réinitialiser mot de passe (SMTP)" as UC_ResetPass
        usecase "Changer son mot de passe" as UC_ChangePass
    }

    package "Espace Candidat" {
        usecase "Gérer son profil professionnel" as UC_Profile
        usecase "Téléverser / Remplacer son CV\\n(PDF, Word, TXT, RTF, ODT)" as UC_UploadCV
        usecase "Consulter et rechercher des offres" as UC_BrowseJobs
        usecase "Postuler à une offre d'emploi" as UC_Apply
        usecase "Suivre l'état de ses candidatures" as UC_TrackApps
    }

    package "Espace Recruteur" {
        usecase "Publier et gérer les offres d'emploi" as UC_ManageJobs
        usecase "Consulter les candidatures reçues" as UC_ViewApps
        usecase "Évaluer une candidature via IA" as UC_EvaluateAI
        usecase "Consulter l'explication du score (XAI)" as UC_XAI
        usecase "Mettre à jour le statut du candidat" as UC_UpdateStatus
    }

    package "Administration & Gouvernance" {
        usecase "Gérer les utilisateurs et leurs rôles" as UC_ManageUsers
        usecase "Gérer le référentiel des compétences" as UC_ManageSkills
        usecase "Configurer les paramètres système" as UC_ConfigSys
        usecase "Consulter le journal d'audit et la télémétrie" as UC_AuditTelemetry
    }
}

Candidat --> UC_Auth
Candidat --> UC_ResetPass
Candidat --> UC_ChangePass
Candidat --> UC_Profile
Candidat --> UC_UploadCV
Candidat --> UC_BrowseJobs
Candidat --> UC_Apply
Candidat --> UC_TrackApps

Recruteur --> UC_Auth
Recruteur --> UC_ResetPass
Recruteur --> UC_ChangePass
Recruteur --> UC_ManageJobs
Recruteur --> UC_ViewApps
Recruteur --> UC_EvaluateAI
Recruteur --> UC_UpdateStatus

Admin --> UC_Auth
Admin --> UC_ManageUsers
Admin --> UC_ManageSkills
Admin --> UC_ConfigSys
Admin --> UC_AuditTelemetry

UC_Apply ..> UC_UploadCV : <<include>>
UC_EvaluateAI ..> UC_XAI : <<include>>
UC_EvaluateAI ..> MoteurIA : <<sollicite>>
@enduml
"""

# 2. Class Diagram
CLASS_PUML = """@startuml
skinparam classAttributeIconSize 0
skinparam monochrome false
skinparam shadowing true
skinparam linetype ortho
skinparam packageStyle rectangle
skinparam roundcorner 8

skinparam class {
    BackgroundColor #FFFFFF
    BorderColor #2D3748
    ArrowColor #2D3748
}

package "Authentification & Profils" #EBF8FF {
    enum Role {
        CANDIDATE
        RECRUITER
        ADMIN
    }

    class User {
        - Long id
        - String email
        - String password
        - Role role
        - LocalDateTime createdAt
        - LocalDateTime updatedAt
        + boolean hasRole(Role role)
    }

    class CandidateProfile {
        - Long id
        - String firstName
        - String lastName
        - String phone
        - String title
        - String education
        - String experienceSummary
        - String skills
        + String getFullName()
    }

    class RecruiterProfile {
        - Long id
        - String companyName
        - String companyWebsite
        - String industry
        - String location
    }

    class PasswordResetToken {
        - Long id
        - String token
        - LocalDateTime expiryDate
        - boolean used
        - LocalDateTime createdAt
        + boolean isExpired()
    }

    User "1" *-- "1" Role
    User "1" o-- "0..1" CandidateProfile : possède
    User "1" o-- "0..1" RecruiterProfile : possède
    User "1" *-- "0..*" PasswordResetToken : génère
}

package "Offres & Candidatures" #F0FFF4 {
    enum JobStatus {
        ACTIVE
        CLOSED
        DRAFT
    }

    enum EmploymentType {
        FULL_TIME
        PART_TIME
        CONTRACT
        INTERNSHIP
    }

    enum WorkplaceType {
        ON_SITE
        HYBRID
        REMOTE
    }

    enum ApplicationStatus {
        SUBMITTED
        UNDER_REVIEW
        SHORTLISTED
        REJECTED
        ACCEPTED
    }

    class JobOffer {
        - Long id
        - String title
        - String description
        - String department
        - String location
        - String requiredSkills
        - JobStatus status
        - EmploymentType employmentType
        - WorkplaceType workplaceType
        - LocalDateTime createdAt
        - LocalDateTime updatedAt
        + boolean isActive()
    }

    class Application {
        - Long id
        - ApplicationStatus status
        - LocalDateTime appliedAt
        - LocalDateTime updatedAt
        + void updateStatus(ApplicationStatus newStatus)
    }

    JobOffer "1" *-- "1" JobStatus
    JobOffer "1" *-- "1" EmploymentType
    JobOffer "1" *-- "1" WorkplaceType

    User "1" -- "0..*" JobOffer : "publie"
    User "1" -- "0..*" Application : "postule"
    JobOffer "1" -- "0..*" Application : "reçoit"
    Application "1" *-- "1" ApplicationStatus
}

package "Gestion Documentaire & IA (XAI)" #FFF5F5 {
    enum AiProvider {
        GEMINI
        GROQ
        MISTRAL
        OLLAMA
        LOCAL
    }

    class CVDocument {
        - Long id
        - String originalFileName
        - String fileName
        - String filePath
        - Long fileSize
        - String contentType
        - String extractedText
        - LocalDateTime createdAt
        + boolean isPdf()
        + String getExtension()
    }

    class CVAnalysis {
        - Long id
        - Double overallScore
        - Double skillsScore
        - Double experienceScore
        - Double educationScore
        - String strengths
        - String weaknesses
        - String recommendation
        - AiProvider aiEngineUsed
        - Long executionTimeMs
        - LocalDateTime createdAt
        + boolean isRecommended()
    }

    User "1" -- "0..*" CVDocument : "téléverse"
    Application "1" o-- "1" CVDocument : "utilise"
    Application "1" *-- "0..1" CVAnalysis : "est évaluée par"
    CVAnalysis "1" *-- "1" AiProvider
}

package "Gouvernance, Audit & Configuration" #FAF5FF {
    class Skill {
        - Long id
        - String name
        - String category
        - Integer usageCount
        - LocalDateTime createdAt
    }

    class SystemConfig {
        - Long id
        - String configKey
        - String configValue
        - String description
        - LocalDateTime updatedAt
    }

    class AuditLog {
        - Long id
        - String action
        - String targetResource
        - String details
        - String ipAddress
        - LocalDateTime timestamp
    }

    User "1" -- "0..*" AuditLog : "déclenche"
}
@enduml
"""

# 3. System Architecture Diagram
ARCH_PUML = """@startuml
skinparam packageStyle rectangle
skinparam shadowing true
skinparam roundcorner 8
skinparam linetype ortho

skinparam node {
    BackgroundColor #FFFFFF
    BorderColor #2B6CB0
}

package "1. Couche Présentation (Frontend)" #EBF8FF {
    node "Navigateur Web (Utilisateur)" as Browser
    node "Angular 17+ & Tailwind CSS\\n[SPA sous Nginx - Port 4200]" as AngularApp
    Browser <--> AngularApp : HTTP / JSON
}

package "2. Couche Métier & Services (Backend)" #F0FFF4 {
    node "API REST Spring Boot 3\\n[Java 21 - Port 8080]" as Backend
    node "Spring Security & JWT\\n[RBAC: Candidate, Recruiter, Admin]" as Security
    node "Analyseur Documentaire\\n[Apache PDFBox & Parsers TXT/Word]" as Parser
    
    AngularApp <--> Backend : Requêtes REST (JSON / JWT)
    Backend ..> Security : Valide les requêtes
    Backend ..> Parser : Extrait le texte des CV
}

package "3. Couche Persistance & Moteurs d'IA" #FFF5F5 {
    database "Base de Données\\nPostgreSQL 16\\n[Migrations Flyway - Port 5432]" as DB
    
    node "Moteurs d'IA Hybrides (XAI)" as AIEngines {
        node "Google Gemini (2.5/1.5 Flash)" as Gemini
        node "GroqCloud (Llama 3.3 70B)" as Groq
        node "Mistral AI / OpenRouter" as Mistral
        node "Ollama (LLM Local)" as Ollama
        node "Moteur Local Déterministe\\n[Fallback sans panne]" as Fallback
    }
    
    node "Serveur SMTP Mailtrap\\n[Réinitialisation Mot de Passe]" as Mailtrap

    Backend <--> DB : Spring Data JPA / JDBC
    Backend <--> AIEngines : Évaluation sémantique & XAI
    Backend --> Mailtrap : Envoi e-mails
}
@enduml
"""

download_diagram("diagramme_cas_utilisation", USE_CASE_PUML)
download_diagram("diagramme_classes", CLASS_PUML)
download_diagram("diagramme_architecture", ARCH_PUML)

# Build HTML viewer page
html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>HireSmart AI - Diagrammes PFE</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px; margin: 0; }}
        h1 {{ text-align: center; color: #0f172a; margin-bottom: 8px; }}
        p.subtitle {{ text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px; }}
        .card {{ background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 40px; overflow: hidden; }}
        .card-header {{ padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; }}
        .card-title {{ font-size: 18px; font-weight: bold; color: #0f172a; }}
        .btn-group {{ display: flex; gap: 10px; }}
        .btn {{ padding: 8px 16px; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: all 0.2s; }}
        .btn-png {{ background: #2563eb; color: white; }}
        .btn-png:hover {{ background: #1d4ed8; }}
        .btn-svg {{ background: #059669; color: white; }}
        .btn-svg:hover {{ background: #047857; }}
        .img-container {{ padding: 24px; text-align: center; overflow-x: auto; background: #ffffff; }}
        img {{ max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
    </style>
</head>
<body>
    <h1>HireSmart AI - Diagrammes du Rapport PFE</h1>
    <p class="subtitle">Cliquez sur les boutons pour télécharger directement chaque schéma en haute résolution (PNG ou SVG).</p>

    <!-- 1. Use Case -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">1. Diagramme des Cas d'Utilisation Global</span>
            <div class="btn-group">
                <a class="btn btn-png" href="diagramme_cas_utilisation.png" download>Télécharger PNG</a>
                <a class="btn btn-svg" href="diagramme_cas_utilisation.svg" download>Télécharger SVG</a>
            </div>
        </div>
        <div class="img-container">
            <img src="diagramme_cas_utilisation.png" alt="Diagramme des Cas d'Utilisation">
        </div>
    </div>

    <!-- 2. Class Diagram -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">2. Diagramme de Classes (Architecture des Données)</span>
            <div class="btn-group">
                <a class="btn btn-png" href="diagramme_classes.png" download>Télécharger PNG</a>
                <a class="btn btn-svg" href="diagramme_classes.svg" download>Télécharger SVG</a>
            </div>
        </div>
        <div class="img-container">
            <img src="diagramme_classes.png" alt="Diagramme de Classes">
        </div>
    </div>

    <!-- 3. Architecture -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">3. Diagramme de l'Architecture du Système</span>
            <div class="btn-group">
                <a class="btn btn-png" href="diagramme_architecture.png" download>Télécharger PNG</a>
                <a class="btn btn-svg" href="diagramme_architecture.svg" download>Télécharger SVG</a>
            </div>
        </div>
        <div class="img-container">
            <img src="diagramme_architecture.png" alt="Diagramme d'Architecture">
        </div>
    </div>
</body>
</html>
"""

html_path = os.path.join(DIAGRAMS_DIR, "telecharger_diagrammes.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)
print(f"[OK] Created HTML viewer: {html_path}")

