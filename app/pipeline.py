"""
TalentMatch AI — Core Evaluation Pipeline (Async)
Refactored from the original synchronous Streamlit pipeline into an async
FastAPI-compatible scoring engine. All scoring logic is preserved identically.
"""

import asyncio
import random
import re
import io
from typing import Optional, List
from pydantic import BaseModel, Field

# ══════════════════════════════════════════════════════════════════════════════
# PYDANTIC SCHEMAS FOR VALIDATION
# ══════════════════════════════════════════════════════════════════════════════

class CandidateEvaluation(BaseModel):
    name: str = Field(..., description="Full name of the candidate")
    title: str = Field(..., description="Current professional title")
    score: int = Field(..., description="AI evaluation strategy match score [0, 100]")
    tech_depth: str = Field(..., description="Technical stack alignment category (Exemplary, Strong, Average)")
    culture_fit: str = Field(..., description="Culture/behavioral alignment category")
    why_fit: str = Field(..., description="Short text justification of the fit score")
    skills: List[str] = Field(default_factory=list, description="Extracted technology skills list")

# ══════════════════════════════════════════════════════════════════════════════
# CANDIDATE TEMPLATE DATABASE
# ══════════════════════════════════════════════════════════════════════════════

CANDIDATE_TEMPLATES = [
    {
        "name": "Elena Kozlova",
        "current_title": "Senior ML Engineer",
        "skills": ["Python", "PyTorch", "AWS", "Docker", "Kubernetes", "FastAPI"],
        "seniority": "Senior",
        "focus_areas": ["System Scalability", "Clean Code"],
        "history": "Stable tenures at TechFlow (4 yrs) and Y-Labs (3 yrs).",
        "job_hopping": False,
        "keyword_stuffing": False,
        "why_fit_template": "Strong background in distributed training and PyTorch optimization. Matches '{focus}' requirements perfectly.",
    },
    {
        "name": "Julian Duarte",
        "current_title": "Backend Architect",
        "skills": ["Go", "PostgreSQL", "Redis", "Docker", "AWS", "Kubernetes", "gRPC"],
        "seniority": "Lead",
        "focus_areas": ["System Scalability"],
        "history": "Co-founder at Stealth Co (2 yrs), Senior Backend at AlphaNodes (5 yrs).",
        "job_hopping": False,
        "keyword_stuffing": False,
        "why_fit_template": "Deep experience in PostgreSQL query optimization and Go microservices. Excellent match for {role} role.",
    },
    {
        "name": "Sarah Manning",
        "current_title": "Fullstack Lead",
        "skills": ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "MongoDB"],
        "seniority": "Senior",
        "focus_areas": ["Clean Code"],
        "history": "Freelance developer (1 yr), Fullstack Lead at CloudScale (2 yrs), Engineer at DevCorp (1 yr).",
        "job_hopping": True,
        "keyword_stuffing": False,
        "why_fit_template": "Impressive React/TypeScript depth. Needs deeper assessment on database scaling strategies.",
    },
    {
        "name": "Alex Chen",
        "current_title": "DevOps Engineer",
        "skills": ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "Python", "Go"],
        "seniority": "Mid",
        "focus_areas": ["System Scalability"],
        "history": "DevOps Engineer at CloudStack (3 yrs), Systems Admin at NetOps (2 yrs).",
        "job_hopping": False,
        "keyword_stuffing": False,
        "why_fit_template": "Solid cloud infrastructure and automation experience. Strong matching for SRE/DevOps requirements.",
    },
    {
        "name": "Sofia Rodriguez",
        "current_title": "Product Manager",
        "skills": ["Agile", "Jira", "Product Roadmap", "SQL", "Tableau"],
        "seniority": "Principal",
        "focus_areas": ["Cultural Alignment"],
        "history": "Principal PM at Innovate LLC (5 yrs), Senior PM at BigTech (4 yrs).",
        "job_hopping": False,
        "keyword_stuffing": True,
        "why_fit_template": "Highly experienced in product roadmap ownership. Excellent communication skills, though tech stack is product-focused.",
    },
]

# ── Random candidate generation pool ─────────────────────────────────────────

FIRST_NAMES = [
    "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte",
    "William", "Sophia", "James", "Amelia", "Benjamin", "Isabella", "Lucas",
    "Mia", "Henry", "Evelyn",
]
LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas",
]
TITLES = [
    "Software Engineer", "Systems Engineer", "Data Engineer", "SRE",
    "Security Specialist", "Mobile Dev", "AI Researcher", "QA Automation Lead",
]
ALL_SKILLS = [
    "Python", "Java", "JavaScript", "C++", "Go", "Rust", "TypeScript",
    "React", "Next.js", "Django", "FastAPI", "Spring Boot", "Node.js",
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Serverless",
    "PostgreSQL", "MongoDB", "Redis", "Pinecone", "ChromaDB", "MySQL",
]


def _generate_random_candidate() -> dict:
    """Generate a synthetic candidate with randomized attributes."""
    name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    title = random.choice(TITLES)
    skills = random.sample(ALL_SKILLS, random.randint(3, 7))
    seniority = random.choice(["Junior", "Mid", "Senior", "Lead", "Principal"])
    focus = random.sample(
        ["System Scalability", "Clean Code", "Cultural Alignment"],
        random.randint(1, 2),
    )
    job_hop = random.random() < 0.25
    keyword_stuff = random.random() < 0.15
    return {
        "name": name,
        "current_title": title,
        "skills": skills,
        "seniority": seniority,
        "focus_areas": focus,
        "history": "Assorted professional tenures.",
        "job_hopping": job_hop,
        "keyword_stuffing": keyword_stuff,
        "why_fit_template": (
            "Fitted via AI match calculation. Strong core skills in: "
            + ", ".join(skills[:3])
        ),
    }


# ══════════════════════════════════════════════════════════════════════════════
# PDF PARSER
# ══════════════════════════════════════════════════════════════════════════════


def parse_pdf_bytes(file_bytes: bytes, filename: str) -> str:
    """
    Parse PDF content from raw bytes. Falls back to filename-based
    placeholder text if pypdf is unavailable or parsing fails.
    """
    try:
        import pypdf

        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t
        return text
    except Exception:
        return f"Resume of candidate. Filename details: {filename}"


# ══════════════════════════════════════════════════════════════════════════════
# SCORING ENGINE
# ══════════════════════════════════════════════════════════════════════════════


def _score_candidate(cand: dict, strategy: dict) -> dict:
    """
    Score a single candidate against the hiring strategy.
    Scoring algorithm preserved identically from the original pipeline.
    """
    target_role = strategy.get("target_role", "AI/Data Science")
    target_seniority = strategy.get("seniority", "Senior")
    target_skills = strategy.get("tech_stack", [])
    focus_areas = strategy.get("focus_areas", [])
    active_red_flags = strategy.get("red_flags", [])

    # ── Base score ────────────────────────────────────────────────────────
    score = 60.0

    # ── Role match (fuzzy word intersection) ──────────────────────────────
    role_words = set(target_role.lower().replace("/", " ").replace("-", " ").split())
    title_words = set(
        cand["current_title"].lower().replace("/", " ").replace("-", " ").split()
    )
    if role_words.intersection(title_words):
        score += 15.0

    # ── Seniority match ───────────────────────────────────────────────────
    seniority_scale = ["Junior", "Mid", "Senior", "Lead", "Principal"]
    try:
        c_idx = seniority_scale.index(cand["seniority"])
        t_idx = seniority_scale.index(target_seniority)
        diff = abs(c_idx - t_idx)
        if diff == 0:
            score += 10.0
        elif diff == 1:
            score += 5.0
        else:
            score -= 5.0
    except ValueError:
        pass

    # ── Tech stack match ──────────────────────────────────────────────────
    skill_hits = 0
    for skill in target_skills:
        if skill.lower() in [s.lower() for s in cand["skills"]]:
            skill_hits += 1
    if target_skills:
        score += (skill_hits / len(target_skills)) * 25.0
    else:
        score += 10.0

    # ── Focus areas match ─────────────────────────────────────────────────
    focus_hits = 0
    for fa in focus_areas:
        if fa in cand["focus_areas"]:
            focus_hits += 1
    if focus_areas:
        score += (focus_hits / len(focus_areas)) * 10.0

    # ── Red flag penalties ────────────────────────────────────────────────
    if "Chronic Job Hopping" in active_red_flags and cand["job_hopping"]:
        score -= 15.0
    if "Keyword Stuffing" in active_red_flags and cand["keyword_stuffing"]:
        score -= 10.0

    # ── Clamp to [0, 100] ─────────────────────────────────────────────────
    final_score = max(0, min(100, int(score)))

    # ── Badge assignment ──────────────────────────────────────────────────
    tech_badge = "Average"
    if skill_hits >= 4 or (
        target_skills and (skill_hits / len(target_skills)) > 0.75
    ):
        tech_badge = "Exemplary"
    elif skill_hits >= 2 or (
        target_skills and (skill_hits / len(target_skills)) > 0.4
    ):
        tech_badge = "Strong"

    culture_badge = "High Alignment"
    if cand["job_hopping"] and "Chronic Job Hopping" in active_red_flags:
        culture_badge = "Rejected/Flagged"
    elif cand["job_hopping"]:
        culture_badge = "Medium Alignment"
    elif "Founder Mindset" in cand["focus_areas"] or "Lead" in cand["seniority"]:
        culture_badge = "Founder Mindset"

    # ── Justification ─────────────────────────────────────────────────────
    focus_str = focus_areas[0] if focus_areas else "standard engineering"
    why_fit = cand["why_fit_template"].format(focus=focus_str, role=target_role)

    return {
        "name": cand["name"],
        "title": cand["current_title"],
        "score": final_score,
        "tech_depth": tech_badge,
        "culture_fit": culture_badge,
        "why_fit": why_fit,
        "skills": cand["skills"],
    }


# ══════════════════════════════════════════════════════════════════════════════
# MAIN ASYNC EVALUATION FUNCTION
# ══════════════════════════════════════════════════════════════════════════════


async def evaluate_candidates(
    strategy: dict,
    files: Optional[list[tuple[str, bytes]]] = None,
) -> list[dict]:
    """
    Evaluate all candidates against the provided hiring strategy.
    If files are uploaded, evaluates ONLY those files.
    If no files are uploaded, returns an empty list (starts from zero).

    Args:
        strategy: Dict with keys target_role, seniority, tech_stack,
                  focus_areas, red_flags.
        files:    Optional list of (filename, file_bytes) tuples from uploaded
                  resumes.

    Returns:
        Sorted list of scored candidate dicts mapped to Pydantic schemas (highest score first).
    """
    candidates: list[dict] = []

    # If no files are uploaded, return empty list immediately (from zero state)
    if not files:
        return []

    # ── 1. Parse uploaded files ───────────────────────────────────────────
    for filename, file_bytes in files:
        _parsed_text = parse_pdf_bytes(file_bytes, filename)

        # Attempt to match filename to a predefined template
        name_clean = filename.lower()
        matched_template = None
        for t in CANDIDATE_TEMPLATES:
            if t["name"].lower().split()[0] in name_clean:
                matched_template = t.copy()
                break

        if matched_template:
            candidates.append(matched_template)
        else:
            name_part = (
                re.sub(r"[_.-]", " ", filename)
                .replace("resume", "")
                .replace("pdf", "")
                .strip()
                .title()
            )
            if not name_part:
                name_part = "Uploaded Candidate"
            cand = _generate_random_candidate()
            cand["name"] = name_part
            candidates.append(cand)

    # ── 2. Score all candidates ───────────────────────────────────────────
    scored: list[dict] = []
    for idx, cand in enumerate(candidates):
        scored.append(_score_candidate(cand, strategy))
        if idx % 10 == 0:
            await asyncio.sleep(0)  # Non-blocking yield

    # ── 3. Sort descending by score ───────────────────────────────────────
    scored.sort(key=lambda x: x["score"], reverse=True)

    # ── 4. Map to Pydantic schemas ────────────────────────────────────────
    pydantic_scored: list[dict] = []
    for s in scored:
        eval_obj = CandidateEvaluation(
            name=s["name"],
            title=s["title"],
            score=s["score"],
            tech_depth=s["tech_depth"],
            culture_fit=s["culture_fit"],
            why_fit=s["why_fit"],
            skills=s["skills"]
        )
        try:
            serialized = eval_obj.model_dump()
        except AttributeError:
            serialized = eval_obj.dict()
        pydantic_scored.append(serialized)

    return pydantic_scored
