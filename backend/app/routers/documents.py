from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import Document, User
from ..schemas.document import DocumentUploadResponse, DocumentOut
from ..core.security import get_current_user
from ..services.document_service import process_uploaded_document

router = APIRouter(prefix="/documents", tags=["AI Learning Studio Documents"])

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Max file size 25MB
    content = await file.read()
    if len(content) > 25 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 25MB limit."
        )

    extracted_text = process_uploaded_document(file.filename, content)
    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from this document. Please ensure it is not an empty or password-protected file."
        )

    file_ext = file.filename.split(".")[-1].lower() if "." in file.filename else "txt"

    doc = Document(
        user_id=current_user.id,
        filename=file.filename,
        file_type=file_ext,
        file_size_bytes=len(content),
        extracted_text=extracted_text,
        character_count=len(extracted_text)
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    preview = extracted_text[:300] + ("..." if len(extracted_text) > 300 else "")

    return DocumentUploadResponse(
        id=doc.id,
        filename=doc.filename,
        file_type=doc.file_type,
        file_size_bytes=doc.file_size_bytes,
        character_count=doc.character_count,
        preview_text=preview,
        created_at=doc.created_at,
        message="Document successfully processed and ready for AI Quiz Generation."
    )

@router.get("", response_model=List[DocumentOut])
def list_my_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
