from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import Document, User
from ..schemas.document import DocumentUploadResponse, DocumentOut
from ..core.security import get_current_user
from ..services.document_service import process_uploaded_document

router = APIRouter(prefix="/documents", tags=["AI Learning Studio Documents"])

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "pptx", "ppt", "txt"}
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validate filename
    if not file.filename or not file.filename.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is missing or invalid."
        )

    clean_filename = file.filename.strip()
    if "." not in clean_filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File has no extension. Allowed formats: PDF, DOCX, DOC, PPTX, PPT, TXT."
        )

    file_ext = clean_filename.split(".")[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '.{file_ext}'. Allowed formats: PDF, DOCX, DOC, PPTX, PPT, TXT."
        )

    # 2. Read and validate file size
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes)."
        )

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 25MB maximum limit."
        )

    # 3. Extract text safely
    try:
        extracted_text = process_uploaded_document(clean_filename, content)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from document. Ensure the file is not corrupted or password protected."
        )

    if not extracted_text or not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from this document. Please ensure it contains readable text and is not an empty or scanned image-only file."
        )

    doc = Document(
        user_id=current_user.id,
        filename=clean_filename,
        file_type=file_ext,
        file_size_bytes=len(content),
        extracted_text=extracted_text.strip(),
        character_count=len(extracted_text.strip())
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    preview = extracted_text.strip()[:300] + ("..." if len(extracted_text.strip()) > 300 else "")

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
