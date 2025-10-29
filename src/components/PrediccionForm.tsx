import { useState } from "react";
import "./PrediccionForm.css";

interface Resultado {
  usuario: string;
  resultado: string;
  probabilidad_resultado: number | string;
  probabilidades_detalladas: {
    graduacion: number;
    abandono: number;
  } | string;
}

export default function PrediccionForm() {
  const [formData, setFormData] = useState({
    Marital_status: 1,
    Application_mode: 8,
    Application_order: 1,
    Course: 10,
    Daytime_evening_attendance: 1,
    Previous_qualification: 1,
    Nacionality: 1,
    Mothers_qualification: 13,
    Fathers_qualification: 10,
    Mothers_occupation: 6,
    Fathers_occupation: 10,
    Displaced: 0,
    Educational_special_needs: 0,
    Debtor: 0,
    Tuition_fees_up_to_date: 1,
    Gender: 0,
    Scholarship_holder: 1,
    Age_at_enrollment: 19,
    International: 0,
    Curricular_units_1st_sem_credited: 0,
    Curricular_units_1st_sem_enrolled: 6,
    Curricular_units_1st_sem_evaluations: 6,
    Curricular_units_1st_sem_approved: 6,
    Curricular_units_1st_sem_grade: 16.8,
    Curricular_units_1st_sem_without_evaluations: 0,
    Curricular_units_2nd_sem_credited: 0,
    Curricular_units_2nd_sem_enrolled: 6,
    Curricular_units_2nd_sem_evaluations: 6,
    Curricular_units_2nd_sem_approved: 6,
    Curricular_units_2nd_sem_grade: 17.2,
    Curricular_units_2nd_sem_without_evaluations: 0,
    Unemployment_rate: 8.5,
    Inflation_rate: 1.2,
    GDP: 12.0,
  });

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value === "" ? "" : Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch("https://desercion_api.quods.xyz/predecir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:12345"),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data: Resultado = await response.json();
      setResultado(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* VARIABLES CRÍTICAS */}
      <div className="form-section section-critical">
        <h2 className="section-title">Variables Críticas (Mayor Impacto)</h2>
        <div className="form-grid">
          <div className="form-field">
            <span className="form-label">Unidades Aprobadas 2do Semestre</span>
            <input
              type="number"
              name="Curricular_units_2nd_sem_approved"
              value={formData.Curricular_units_2nd_sem_approved}
              onChange={handleChange}
              min={0}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Nota Promedio 2do Semestre (0-20)</span>
            <input
              type="number"
              step="0.1"
              name="Curricular_units_2nd_sem_grade"
              value={formData.Curricular_units_2nd_sem_grade}
              onChange={handleChange}
              min={0}
              max={20}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Unidades Aprobadas 1er Semestre</span>
            <input
              type="number"
              name="Curricular_units_1st_sem_approved"
              value={formData.Curricular_units_1st_sem_approved}
              onChange={handleChange}
              min={0}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Nota Promedio 1er Semestre (0-20)</span>
            <input
              type="number"
              step="0.1"
              name="Curricular_units_1st_sem_grade"
              value={formData.Curricular_units_1st_sem_grade}
              onChange={handleChange}
              min={0}
              max={20}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Matrícula al Día</span>
            <select
              name="Tuition_fees_up_to_date"
              value={formData.Tuition_fees_up_to_date}
              onChange={handleChange}
              className="form-select"
            >
              <option value={1}>Sí</option>
              <option value={0}>No</option>
            </select>
          </div>

          <div className="form-field">
            <span className="form-label">Becario</span>
            <select
              name="Scholarship_holder"
              value={formData.Scholarship_holder}
              onChange={handleChange}
              className="form-select"
            >
              <option value={1}>Sí</option>
              <option value={0}>No</option>
            </select>
          </div>
        </div>
      </div>

      {/* VARIABLES IMPORTANTES */}
      <div className="form-section section-important">
        <h2 className="section-title">Variables Importantes</h2>
        <div className="form-grid">
          <div className="form-field">
            <span className="form-label">Edad al Inscribirse</span>
            <input
              type="number"
              name="Age_at_enrollment"
              value={formData.Age_at_enrollment}
              onChange={handleChange}
              min={17}
              max={70}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Deudor</span>
            <select
              name="Debtor"
              value={formData.Debtor}
              onChange={handleChange}
              className="form-select"
            >
              <option value={0}>No</option>
              <option value={1}>Sí</option>
            </select>
          </div>

          <div className="form-field">
            <span className="form-label">Género</span>
            <select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value={0}>Femenino</option>
              <option value={1}>Masculino</option>
            </select>
          </div>

          <div className="form-field">
            <span className="form-label">Modo de Aplicación</span>
            <input
              type="number"
              name="Application_mode"
              value={formData.Application_mode}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* VARIABLES MACROECONÓMICAS */}
      <div className="form-section section-macroeconomic">
        <h2 className="section-title">Variables Macroeconómicas</h2>
        <div className="form-grid">
          <div className="form-field">
            <span className="form-label">Tasa de Desempleo (%)</span>
            <input
              type="number"
              step="0.1"
              name="Unemployment_rate"
              value={formData.Unemployment_rate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Tasa de Inflación (%)</span>
            <input
              type="number"
              step="0.1"
              name="Inflation_rate"
              value={formData.Inflation_rate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">PIB</span>
            <input
              type="number"
              step="0.1"
              name="GDP"
              value={formData.GDP}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={cargando} className="submit-button">
        {cargando ? "Prediciendo..." : "Generar Predicción"}
      </button>

      {error && (
        <div className="error-container">
          <p className="error-title">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {resultado && (
        <div className="result-container">
          <div className="result-content">
            <p className="result-text">{resultado.resultado}</p>
            <div className="probability-container">
              <p className="probability-label">
                Probabilidad del Resultado
              </p>
              <p className="probability-value">
                {resultado.probabilidad_resultado}
              </p>
            </div>
            
            {typeof resultado.probabilidades_detalladas === 'object' && (
              <div className="detailed-probabilities">
                <h4 className="probabilities-title">Probabilidades Detalladas</h4>
                <div className="probabilities-grid">
                  <div className="probability-item">
                    <span className="probability-label">Graduación:</span>
                    <span className="probability-value">
                      {resultado.probabilidades_detalladas.graduacion}
                    </span>
                  </div>
                  <div className="probability-item">
                    <span className="probability-label">Abandono:</span>
                    <span className="probability-value">
                      {resultado.probabilidades_detalladas.abandono}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <p className="user-info">
              Usuario: <span className="font-semibold">{resultado.usuario}</span>
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
