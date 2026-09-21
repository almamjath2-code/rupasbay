import secrets
import hashlib
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional


from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends, Header

from models import Admin, AdminAPIKey
from database import get_db




# ============================================================
# ADMIN API KEY GENERATION
# ============================================================

def generate_admin_api_key() -> str:
    """
    Generate a secure random admin API key.
    """
    return secrets.token_urlsafe(32)


# ============================================================
# HASH API KEY
# ============================================================

def hash_admin_key(api_key: str) -> str:
    """
    Hash an admin API key before storing/checking it.
    """
    return hashlib.sha256(api_key.encode("utf-8")).hexdigest()


# ============================================================
# CREATE ADMIN API KEY
# ============================================================

def create_admin_api_key(
    db: Session,
    admin_id: int,
    name: Optional[str] = None
) -> str:
    """
    Create a new API key for an admin.

    The raw API key is returned only once.
    Only the SHA256 hash is stored in the database.
    """

    raw_key = generate_admin_api_key()

    key_hash = hash_admin_key(raw_key)

    db_key = AdminAPIKey(
        key_hash=key_hash,
        admin_id=admin_id,
        name=name or f"Key_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
    )

    db.add(db_key)
    db.commit()
    db.refresh(db_key)

    # IMPORTANT:
    # Return raw key only once.
    return raw_key


# ============================================================
# VERIFY ADMIN API KEY
# ============================================================

def verify_admin_key(
    db: Session,
    api_key: str
) -> Optional[Admin]:
    """
    Verify an admin API key.

    Returns:
        Admin object if key is valid.
        None if key is invalid/inactive.
    """

    if not api_key:
        return None

    # Hash the received raw key
    key_hash = hash_admin_key(api_key)

    # Find active key
    db_key = (
        db.query(AdminAPIKey)
        .filter(
            AdminAPIKey.key_hash == key_hash,
            AdminAPIKey.is_active == True
        )
        .first()
    )

    if not db_key:
        return None

    # Update last-used timestamp
    db_key.last_used = datetime.utcnow()

    db.commit()

    # Return associated admin
    return db_key.admin


# ============================================================
# INVALIDATE ADMIN API KEY
# ============================================================

def invalidate_admin_key(
    db: Session,
    admin_id: int,
    key_id: int
) -> bool:
    """
    Disable an admin API key.
    """

    api_key = (
        db.query(AdminAPIKey)
        .filter(
            AdminAPIKey.id == key_id,
            AdminAPIKey.admin_id == admin_id
        )
        .first()
    )

    if not api_key:
        return False

    api_key.is_active = False

    db.commit()

    return True


# ============================================================
# LIST ADMIN API KEYS
# ============================================================

def list_admin_api_keys(
    db: Session,
    admin_id: int
):
    """
    List admin API keys without exposing the actual keys.
    """

    keys = (
        db.query(AdminAPIKey)
        .filter(
            AdminAPIKey.admin_id == admin_id
        )
        .all()
    )

    result = []

    for key in keys:

        result.append({
            "id": key.id,
            "name": key.name,
            "is_active": key.is_active,
            "created_at": key.created_at,
            "last_used": key.last_used,
            "key_preview": key.key_hash[:8] + "..."
        })

    return result


# ============================================================
# ADMIN AUTHENTICATION DEPENDENCY
# ============================================================

async def get_admin_user(
    secret_key: Optional[str] = Header(
        default=None,
        alias="SECRET_KEY"
    ),
    db: Session = Depends(get_db)
) -> Admin:
    """
    Authenticate admin using SECRET_KEY HTTP header.

    Frontend must send:

        SECRET_KEY: your-admin-api-key
    """

    # --------------------------------------------------------
    # DEBUG LOG
    # --------------------------------------------------------

    print("==========================================")
    print("ADMIN AUTHENTICATION")
    print("Received SECRET_KEY:",  "YES" if secret_key else "NO")
    print("==========================================")

    # --------------------------------------------------------
    # KEY NOT PROVIDED
    # --------------------------------------------------------

    if not secret_key:

        print("ADMIN AUTH ERROR: SECRET_KEY missing")

        raise HTTPException(
            status_code=403,
            detail="Admin API key required"
        )

    # --------------------------------------------------------
    # VERIFY KEY
    # --------------------------------------------------------

    admin = verify_admin_key(
        db=db,
        api_key=secret_key
    )

    # --------------------------------------------------------
    # INVALID KEY
    # --------------------------------------------------------

    if not admin:

        print("ADMIN AUTH ERROR: Invalid or inactive API key")

        raise HTTPException(
            status_code=401,
            detail="Invalid or inactive admin API key"
        )

    # --------------------------------------------------------
    # SUCCESS
    # --------------------------------------------------------

    print(
        "ADMIN AUTH SUCCESS:",
        f"admin_id={admin.id}"
    )

    return admin