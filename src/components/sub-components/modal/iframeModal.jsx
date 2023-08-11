import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ModalComponent({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>Mapa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1qbDhDHUg-QgUhXyCoxftHGHyMOQ2pDg&ehbc=2E312F" width="100%" height="480" allowFullScreen loading=''></iframe>
      </Modal.Body>
    </Modal>
  );
}

export default ModalComponent;