import React, { useState } from 'react';
import Button from '../../Atoms/Button/Button';
import './Accordion.css';

const AccordionItem = ({ title, content, isOpen, onClick }) => {
    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <Button className="accordion-header" onClick={onClick} variant="transparent">
                <span className="accordion-title">{title}</span>
                <span className="accordion-icon">{isOpen ? '-' : '+'}</span>
            </Button>
            <div className="accordion-content" style={{ maxHeight: isOpen ? '1000px' : '0' }}>
                <div className="accordion-content-inner">
                    {content}
                </div>
            </div>
        </div>
    );
};

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <div className="accordion">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndex === index}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
};

export default Accordion;
