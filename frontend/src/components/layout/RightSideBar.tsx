import '../../styles/rightsidebar.css'

import { Section } from "../../types/lms";

interface props {
    sections : Section[];
    onAddSection : () => void;
    onEditSection : (section : Section) => void;
    onDeleteSection : (id : string) => void;
}

const rightsidebar = ({sections,onAddSection,onEditSection,onDeleteSection} : props) => {
    return(
        <aside className='right-sidebar'>
            <h3>Sections</h3>
            {sections.map((s) => (
                <div className="section-row" key={s.section_id}>
                    <span>{s.section_title}</span>
                    <button className="edit-btn" onClick={() => onEditSection(s)}>✏</button>
                    <button className="delete-btn" onClick={() => onDeleteSection(s.section_id)}>🗑</button>
                </div>
            ))}
            <button className="add-section-btn" onClick={onAddSection}>Add Section</button>
        </aside>
    )
}
export default rightsidebar;