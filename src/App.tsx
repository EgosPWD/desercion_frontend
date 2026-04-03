import { useState } from "react";
import PrediccionForm from "./components/PrediccionForm";
import AnalisisMasivo from "./components/AnalisisMasivo";
import AppTabs, { type Vista } from "./components/AppTabs";
import "./App.css";

export default function App() {
  const [vistaActual, setVistaActual] = useState<Vista>("individual");

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <div className="app-card">
          <div className="app-header">
            <h1 className="app-title">
              Predicción de Deserción Universitaria
            </h1>
            <p className="app-subtitle">
              Sistema de predicción basado en análisis de datos académicos
            </p>
          </div>

          <AppTabs vistaActual={vistaActual} onChange={setVistaActual} />

          <div className="app-content">
            {vistaActual === "individual" ? <PrediccionForm /> : <AnalisisMasivo />}
          </div>
        </div>

        <div className="app-footer">
          <p>Sistema de predicción v2.0 - Universidad</p>
        </div>
      </div>
    </div>
  );
}
