import "../../styles/sectionform.css";
import { useState, useEffect } from "react";
import { CreateSectionDto, Section } from "../../types/lms";
import { createSection, updateSection } from "../../api/sectionapi";

interface Props {
  moduleId: string;
  onSuccess: () => void;
  editingSection?: Section | null;
  onUpdate: (s: Section) => void;
  clearEditing: () => void;
}

const SectionForm = ({ moduleId, onSuccess, editingSection, onUpdate, clearEditing }: Props) => {

  const [section_title, setTitle] = useState("");
  const [section_content, setContent] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content_url, setContentUrl] = useState("");
  
  const [image_description, setImageDescription] = useState("");
  const [url_description, setUrlDescription] = useState("");

  const uploadToCloudinary = async (file: File, resourceType: "image" | "video") => {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lms_upload");

    const cloudName = "do3cfxerr";

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile, "image");
    }

    // if (videoFile) {
    //   videoUrl = await uploadToCloudinary(videoFile, "video");
    // }

    const data: CreateSectionDto = {
      section_title,
      section_content,
      module_id: moduleId,
      section_images: imageUrl || undefined,
      image_description: image_description || undefined,
      content_url: content_url || undefined,
      url_description: url_description || undefined,
    };

    if (editingSection) {
      const updated = await updateSection(editingSection.section_id, data);
      onUpdate(updated);
      clearEditing?.();
    } else {
      await createSection(data);
      onSuccess();
    }
  };
  useEffect(() => {
    if (!editingSection) return;
    setTitle(editingSection.section_title);
    setContent(editingSection.section_content || "");
    setImageDescription(editingSection.image_description || "");
    setUrlDescription(editingSection.url_description || "");
    setContentUrl(editingSection.content_url || "");
  }, [editingSection]);
  return (
    <div className="form-wrapper">
      <form className="section-form" onSubmit={handleSubmit}>

        <h2>Add Section</h2>

        <input
          placeholder="Section Title"
          value={section_title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Section Content"
          value={section_content}
          onChange={(e) => setContent(e.target.value)}
        />

        <h3>Upload Image</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <input
          placeholder="Image Description"
          value={image_description}
          onChange={(e) => setImageDescription(e.target.value)}
        />

        <h3>Yt Embed Link</h3>

        <input
          type="text"
          // accept="video/*"
          value={content_url}
          placeholder="Enter youtube embed video link here"
          onChange={(e) => setContentUrl(e.target.value)}
        />

        <input
          placeholder="Video Description"
          value={url_description}
          onChange={(e) => setUrlDescription(e.target.value)}
        />

        <button>{editingSection ? "Save Changes" : "Add"}</button>

      </form>
    </div>
  );
};

export default SectionForm;