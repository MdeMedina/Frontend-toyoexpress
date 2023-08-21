import React, { useEffect, useState, useRef } from 'react';

const MultiAttachmentInput = ({onAttachmentsChange}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [valid, setValid] = useState(true);
  

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const emailAdicional = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === " ") {
      event.preventDefault();
      addAttachment();
    }
  };

  const handleBlur = () => {
    addAttachment()
  };



  const addAttachment = () => {
    let validador = isEmailValid(inputText.trim())
    setValid(isEmailValid(inputText.trim()))
    if (inputText.trim() !== '' && validador) {
      setAttachments([...attachments, inputText.trim()]);
      setInputText('');
      onAttachmentsChange([...attachments, inputText.trim()]);
      console.log(attachments)
    } else {      setInputText('');}
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <div>
        <div className="d-flex justify-content-start">
        { !valid ? 
        <p className='Corrector'>* El correo ingresado no es valido</p> : false
}
        </div>
        <label htmlFor="texto" className='d-flex justify-content-start'>Emails Adicionales</label>
      <textarea
        value={inputText}
        ref={emailAdicional}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleBlur}
        className='form-control'
        placeholder="Escribe aquí y presiona Enter o coma para agregar"
      />
     {!attachments[0] ? false : 
      <div>
        <strong>Enviar a:</strong>
        <ul>
          {attachments.map((attachment, index) => (
            <li key={index}>
              {attachment}{' '}
              <button onClick={() => removeAttachment(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
     }
    </div>
  );
};

export default MultiAttachmentInput;