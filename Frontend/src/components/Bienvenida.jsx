import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// --- 1. Definición de Animaciones (Keyframes) ---

// Animación para el fondo tipo aurora
const auroraAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Animación para el gradiente del título
const textGradientAnimation = keyframes`
  to {
    background-position: 200% center;
  }
`;

// Animación de entrada para los elementos
const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


// --- 2. Creación de Componentes con Estilo (Styled Components) ---

// El contenedor principal con el fondo aurora
const AuroraContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  background: linear-gradient(-45deg, #0b0f19, #1c2541, #3a506b, #5bc0be);
  background-size: 400% 400%;
  animation: ${auroraAnimation} 15s ease infinite;
  font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  overflow: hidden;
`;

// La tarjeta de cristal interactiva
const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 48px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s ease; // Transición suave para el movimiento
  animation: ${fadeInAnimation} 1s ease-out forwards;
`;

// El ícono que flota
const Icon = styled.div`
  font-size: 64px;
  text-shadow: 0 0 15px rgba(135, 206, 235, 0.5);
  animation: ${fadeInAnimation} 1s ease-out 0.2s forwards;
  opacity: 0;
`;

// El título con el gradiente animado
const AnimatedTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -2px;
  margin: 16px 0;
  background: linear-gradient(
    90deg,
    #ffffff,
    #a0d2eb,
    #e5eaf5,
    #a0d2eb,
    #ffffff
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${textGradientAnimation} 5s linear infinite, ${fadeInAnimation} 1s ease-out 0.4s forwards;
  opacity: 0;
`;

// El texto descriptivo
const Description = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto;
  animation: ${fadeInAnimation} 1s ease-out 0.6s forwards;
  opacity: 0;
`;

// --- ✨ NUEVO: Contenedor para los botones de acción ---
const ActionsContainer = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  animation: ${fadeInAnimation} 1s ease-out 0.8s forwards; // Animación con retraso
`;

// --- ✨ NUEVO: Estilo para los botones de cristal ---
const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;


// --- 3. El Componente React ---

function Bienvenida() {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Lógica para el efecto 3D con el ratón
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const rotateX = 20 * (y / height - 0.5);
    const rotateY = -20 * (x / width - 0.5);
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
  };
  
  // Importar la fuente 'Inter'
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <AuroraContainer>
      <WelcomeCard
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Icon>🌌</Icon>
        <AnimatedTitle>Bienvenido al Futuro</AnimatedTitle>
        <Description>
          Estás en <b>SISDOA</b>, donde la complejidad se transforma en claridad.
          Navega por el menú y descubre una nueva era de gestión inteligente.
        </Description>
        
        {/* --- 👇 AQUÍ ESTÁN LOS BOTONES --- */}
        <ActionsContainer>
          <ActionButton onClick={() => navigate('/proyectos')}>
            Ir a Proyectos
          </ActionButton>
          <ActionButton onClick={() => navigate('/periodos')}>
            Ir a Periodos
          </ActionButton>
        </ActionsContainer>
        
      </WelcomeCard>
    </AuroraContainer>
  );
}

export default Bienvenida;