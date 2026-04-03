import type { Interpretabilidad, CaracteristicaImportante } from "../../types/api";
import "./ShapInterpretability.css";

interface ShapInterpretabilityProps {
  interpretabilidad: Interpretabilidad;
}

export default function ShapInterpretability({ interpretabilidad }: ShapInterpretabilityProps) {
  return (
    <div className="interpretability-container">
      <h3 className="interpretability-title">
        Interpretabilidad del Modelo
      </h3>
      <p className="interpretability-description">
        {interpretabilidad.descripcion}
      </p>

      <div className="shap-features">
        <h4 className="shap-subtitle">Características más Influyentes</h4>
        <div className="shap-grid">
          {interpretabilidad.caracteristicas_top.map((caracteristica: CaracteristicaImportante, index: number) => (
            <div key={index} className={`shap-feature-card impact-${caracteristica.impacto_shap >= 0 ? 'positive' : 'negative'}`}>
              <div className="shap-feature-header">
                <span className="shap-rank">#{index + 1}</span>
                <span className="shap-feature-name">{caracteristica.caracteristica}</span>
              </div>
              <div className="shap-feature-content">
                <div className="shap-feature-value">
                  <span className="shap-label">Valor:</span>
                  <span className="shap-value">{caracteristica.valor}</span>
                </div>
                <div className="shap-feature-impact">
                  <span className="shap-label">Impacto SHAP:</span>
                  <span className={`shap-impact ${caracteristica.impacto_shap >= 0 ? 'positive' : 'negative'}`}>
                    {caracteristica.impacto_shap > 0 ? '+' : ''}{caracteristica.impacto_shap.toFixed(4)}
                  </span>
                </div>
                {caracteristica.impacto_coeficiente !== undefined && (
                  <div className="shap-feature-coefficient">
                    <span className="shap-label">Coeficiente:</span>
                    <span className="shap-coefficient">{caracteristica.impacto_coeficiente.toFixed(4)}</span>
                  </div>
                )}
              </div>
              <div className="shap-visual-bar">
                <div
                  className={`shap-bar ${caracteristica.impacto_shap >= 0 ? 'positive' : 'negative'}`}
                  style={{
                    width: `${Math.min(Math.abs(caracteristica.impacto_shap) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {interpretabilidad.nota && (
        <p className="interpretability-note">
          <strong>Nota:</strong> {interpretabilidad.nota}
        </p>
      )}
    </div>
  );
}
