import PrediccionForm from "./components/PrediccionForm";
import "./App.css";

export default function App() {
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

          <div className="app-content">
            <PrediccionForm />
          </div>
        </div>

        <div className="app-footer">
          <p>Sistema de predicción v1.0 - Universidad</p>
        </div>
      </div>
    </div>
  );
}
