import React,{ useState } from "react";
import { submitForm } from "../../api";
import Form from "./Form/Form";
import FormContent from "./FormContent/FormContent";
import './styles.css';

const FormPage = () => {
  const [formData, setFormData] = useState({});
  const [tags, setTags] = useState([]);
  const user = JSON.parse(localStorage.getItem('profile'));

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(tags);
    console.log(user?.result.id, formData);

    await submitForm(user?.result.id, {tags, data: formData});
    window.location='/';
  }

  return (
    <div className="formPage">
      <Form formData={formData} setFormData={setFormData} tags={tags} setTags={setTags}/>
      <FormContent formData={formData} setFormData={setFormData} tags={tags} setTags={setTags}/>
      <button className="addItem" onClick={handleFormSubmit}>Submit</button>
    </div>
  );
};

export default FormPage;
