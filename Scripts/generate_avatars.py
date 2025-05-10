import os
from PIL import Image
import base64
import io
import re # Importation pour le nettoyage potentiel des noms

def resize_and_convert_to_base64(image_path):
    """
    Ouvre une image, la redimensionne en 128x128 (PNG),
    et la convertit en chaîne Base64 pour une data URI.
    """
    try:
        with Image.open(image_path) as img:
            # S'assure qu'on est dans un mode adapté pour PNG avec transparence
            img = img.convert("RGBA")
            # Redimensionne avec un filtre de haute qualité
            img_resized = img.resize((128, 128), Image.LANCZOS)

            # Sauvegarde l'image redimensionnée dans un buffer mémoire au format PNG
            buffer = io.BytesIO()
            img_resized.save(buffer, format="PNG")
            buffer.seek(0)

            # Encode le contenu du buffer en base64
            img_base64 = base64.b64encode(buffer.read()).decode('utf-8')

            return f"data:image/png;base64,{img_base64}"
    except Exception as e:
        print(f"Erreur lors du traitement de {image_path}: {e}")
        return None

def generate_js_avatar_list(folder_path, output_filename="avatars_output.txt"):
    """
    Parcourt un dossier, traite les images PNG, et génère un fichier .txt
    contenant une liste JavaScript d'objets avatar.
    """
    avatar_objects_js = [] # Liste pour stocker les chaînes représentant les objets JS

    print(f"Traitement des images PNG dans le dossier : {os.path.abspath(folder_path)}")

    # Trie les fichiers pour un ordre potentiellement plus cohérent (optionnel)
    filenames = sorted(os.listdir(folder_path))

    for filename in filenames:
        if filename.lower().endswith('.png'):
            full_path = os.path.join(folder_path, filename)
            print(f"  - Traitement de : {filename}")

            data_uri = resize_and_convert_to_base64(full_path)

            if data_uri:
                # Extrait le nom de base du fichier pour l'ID et le Nom
                base_name = os.path.splitext(filename)[0]

                # Génère un ID (utilise le nom de base, pourrait être modifié si besoin)
                avatar_id = base_name

                # Génère un Nom plus lisible (remplace underscores/tirets, met en majuscules)
                # Supprime les numéros potentiels au début ou fin pour un nom plus propre
                clean_name = re.sub(r'^[0-9_-]+|[0-9_-]+$', '', base_name) # Enlève chiffres/underscores/tirets au début/fin
                avatar_name = clean_name.replace('_', ' ').replace('-', ' ').strip().title()
                if not avatar_name: # Si le nom est vide après nettoyage, utilise l'ID
                    avatar_name = avatar_id

                # Formate la chaîne pour l'objet JavaScript
                # Attention aux apostrophes dans les noms si cela peut arriver
                # Utilisation de repr() pour gérer les caractères spéciaux potentiels dans les noms
                js_object_string = f"  {{ id: '{avatar_id}', name: {repr(avatar_name)}, src: '{data_uri}' }}"
                avatar_objects_js.append(js_object_string)
            else:
                 print(f"  - Échec du traitement de : {filename}")


    if not avatar_objects_js:
        print("Aucune image PNG n'a été traitée avec succès.")
        return

    # Assemble la chaîne JavaScript finale
    all_objects_string = ",\n".join(avatar_objects_js)
    final_js_code = f"""<script>
  const AVATAR_LIST = [
{all_objects_string}
  ];
</script>"""

    # Écrit le résultat dans le fichier de sortie unique
    output_path = os.path.join(folder_path, output_filename)
    try:
        with open(output_path, 'w', encoding='utf-8') as txt_file:
            txt_file.write(final_js_code)
        print(f"\nFichier JavaScript généré avec succès : {output_path}")
    except Exception as e:
        print(f"\nErreur lors de l'écriture du fichier de sortie {output_path}: {e}")

# === Utilisation ===
# Mettez ici le chemin vers votre dossier contenant les images PNG
# "." signifie le dossier courant où le script est exécuté
dossier_images = "Avatars" # Remplacez par le chemin de votre dossier d'images
generate_js_avatar_list(dossier_images)