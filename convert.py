import fitz  # PyMuPDF
import os

# Dossiers
PDF_FOLDER = "pdf"
OUTPUT_FOLDER = "output"

# Création dossier output
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Parcours des PDF
for pdf_file in os.listdir(PDF_FOLDER):

    if pdf_file.lower().endswith(".pdf"):

        pdf_path = os.path.join(PDF_FOLDER, pdf_file)

        pdf_name = os.path.splitext(pdf_file)[0]

        # Ouvrir PDF
        doc = fitz.open(pdf_path)

        total_pages = len(doc)

        print(f"\nConversion : {pdf_file}")
        print(f"Nombre de pages : {total_pages}")

        # =========================
        # CAS 1 : UNE SEULE PAGE
        # =========================
        if total_pages == 1:

            page = doc.load_page(0)

            zoom = 3
            mat = fitz.Matrix(zoom, zoom)

            pix = page.get_pixmap(matrix=mat)

            image_path = os.path.join(
                OUTPUT_FOLDER,
                f"{pdf_name}.jpg"
            )

            pix.save(image_path)

            print(f"Image créée : {image_path}")

        # =========================
        # CAS 2 : PLUSIEURS PAGES
        # =========================
        else:

            output_pdf_folder = os.path.join(
                OUTPUT_FOLDER,
                pdf_name
            )

            os.makedirs(output_pdf_folder, exist_ok=True)

            for page_number in range(total_pages):

                page = doc.load_page(page_number)

                zoom = 3
                mat = fitz.Matrix(zoom, zoom)

                pix = page.get_pixmap(matrix=mat)

                image_name = f"page_{page_number + 1:03d}.jpg"

                image_path = os.path.join(
                    output_pdf_folder,
                    image_name
                )

                pix.save(image_path)

                print(f"Page {page_number + 1} sauvegardée")

        doc.close()

print("\nConversion terminée !")