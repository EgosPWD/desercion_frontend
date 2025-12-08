import { useState } from "react";
import "./PrediccionForm.css";

// Descripciones de las variables
const variableDescriptions: { [key: string]: string } = {
  // Variables de Rendimiento Académico
  Curricular_units_2nd_sem_approved: "Número de materias aprobadas en el segundo semestre",
  Curricular_units_2nd_sem_grade: "Promedio de calificaciones del segundo semestre (escala 0-20)",
  Curricular_units_1st_sem_approved: "Número de materias aprobadas en el primer semestre", 
  Curricular_units_1st_sem_grade: "Promedio de calificaciones del primer semestre (escala 0-20)",
  Curricular_units_1st_sem_credited: "Materias convalidadas por estudios previos en primer semestre",
  Curricular_units_1st_sem_enrolled: "Número de materias inscritas en primer semestre",
  Curricular_units_1st_sem_evaluations: "Número total de evaluaciones realizadas en primer semestre",
  Curricular_units_1st_sem_without_evaluations: "Materias sin evaluación en primer semestre",
  Curricular_units_2nd_sem_credited: "Materias convalidadas en segundo semestre",
  Curricular_units_2nd_sem_enrolled: "Materias inscritas en segundo semestre",
  Curricular_units_2nd_sem_evaluations: "Evaluaciones realizadas en segundo semestre",
  Curricular_units_2nd_sem_without_evaluations: "Materias sin evaluación en segundo semestre",
  
  // Variables Financieras
  Tuition_fees_up_to_date: "Indica si el estudiante está al día con el pago de matrícula",
  Debtor: "Indica si el estudiante tiene deudas con la institución",
  
  // Variables de Apoyo Educativo
  Scholarship_holder: "Indica si el estudiante tiene beca",
  Educational_special_needs: "Indica si tiene necesidades educativas especiales o discapacidad",
  
  // Variables Demográficas
  Age_at_enrollment: "Edad del estudiante al momento de inscribirse en la universidad",
  Gender: "Género del estudiante",
  Marital_status: "Estado civil del estudiante (Soltero, Casado, Viudo, etc.)",
  Nacionality: "País de origen del estudiante",
  Displaced: "Indica si el estudiante vive lejos de su lugar de origen/familia",
  International: "Indica si el estudiante es extranjero/internacional",
  
  // Variables de Acceso/Admisión
  Application_mode: "Método o vía de ingreso utilizada (contingente general, transferencia, etc.)",
  Application_order: "Preferencia de elección del curso (0=primera opción, 9=última)",
  Course: "Carrera/programa académico en el que se inscribió",
  Daytime_evening_attendance: "Horario de clases (Diurno o Nocturno)",
  Previous_qualification: "Nivel educativo previo del estudiante",
  
  // Variables Socioeconómicas Familiares
  Mothers_qualification: "Nivel educativo de la madre",
  Fathers_qualification: "Nivel educativo del padre", 
  Mothers_occupation: "Profesión u ocupación de la madre",
  Fathers_occupation: "Profesión u ocupación del padre",
  
  // Variables Macroeconómicas
  Unemployment_rate: "Tasa de desempleo del país al momento de inscripción",
  Inflation_rate: "Tasa de inflación del país al momento de inscripción", 
  GDP: "Producto Interno Bruto del país al momento de inscripción",
  
  // Variables de Salud Mental
  Depression_score: "Puntuación de depresión del estudiante (escala 0-10, donde 10 es más severo)",
  Anxiety_score: "Puntuación de ansiedad del estudiante (escala 0-10, donde 10 es más severo)"
};

interface Resultado {
  usuario: string;
  resultado: string;
  probabilidad_resultado: number | string;
  probabilidades_detalladas: {
    graduacion: number;
    abandono: number;
  } | string;
}

interface FactorRiesgo {
  factor: string;
  impacto: string;
  descripcion: string;
}

interface AnalisisFactores {
  usuario: string;
  prediccion: string;
  probabilidad_abandono: number;
  total_factores_riesgo: number;
  factores_riesgo: FactorRiesgo[];
  nivel_atencion: string;
}

interface Recomendacion {
  tipo: string;
  prioridad: string;
  accion: string;
  descripcion: string;
}

interface Recomendaciones {
  usuario: string;
  prediccion: string;
  probabilidad_abandono: number;
  total_recomendaciones: number;
  recomendaciones: Recomendacion[];
  resumen_factores: string;
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
    Depression_score: 0,
    Anxiety_score: 0,
  });

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [analisisFactores, setAnalisisFactores] = useState<AnalisisFactores | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<Recomendaciones | null>(null);
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
    setAnalisisFactores(null);
    setRecomendaciones(null);

    try {
      const authHeader = "Basic " + btoa("admin:12345");
      const headers = {
        "Content-Type": "application/json",
        Authorization: authHeader,
      };

      // Llamada 1: Predicción básica
      const responsePrediccion = await fetch("https://desercion_api.quods.xyz/predecir", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (!responsePrediccion.ok) throw new Error(`Error HTTP: ${responsePrediccion.status}`);
      const dataPrediccion: Resultado = await responsePrediccion.json();
      setResultado(dataPrediccion);

      // Llamada 2: Análisis de factores de riesgo
      const responseFactores = await fetch("https://desercion_api.quods.xyz/analizar/factores-riesgo", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (responseFactores.ok) {
        const dataFactores: AnalisisFactores = await responseFactores.json();
        setAnalisisFactores(dataFactores);
      }

      // Llamada 3: Recomendaciones
      const responseRecomendaciones = await fetch("https://desercion_api.quods.xyz/recomendaciones", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });

      if (responseRecomendaciones.ok) {
        const dataRecomendaciones: Recomendaciones = await responseRecomendaciones.json();
        setRecomendaciones(dataRecomendaciones);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* INFORMACIÓN SOBRE VARIABLES */}
      <div className="form-section section-info">
        <h2 className="section-title">Información sobre las Variables</h2>
        <div className="info-content">
          <p className="info-text">
            Este formulario utiliza variables categorizadas por su impacto en la predicción de deserción:
          </p>
          <ul className="info-list">
            <li><strong>Variables Críticas:</strong> Tienen el mayor impacto en la predicción (rendimiento académico, situación financiera)</li>
            <li><strong>Variables Importantes:</strong> Contribuyen significativamente al modelo (demográficas, admisión)</li>
            <li><strong>Variables Macroeconómicas:</strong> Contexto económico del país al momento de inscripción</li>
          </ul>
          <p className="info-note">
            <em>Pasa el cursor sobre cada campo para ver su descripción detallada.</em>
          </p>
        </div>
      </div>

      {/* VARIABLES CRÍTICAS */}
      <div className="form-section section-critical">
        <h2 className="section-title">Variables Críticas (Mayor Impacto)</h2>
        <div className="form-grid">
          <div className="form-field">
            <span className="form-label">Unidades Aprobadas 2do Semestre</span>
            <span className="form-description">
              {variableDescriptions.Curricular_units_2nd_sem_approved}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Curricular_units_2nd_sem_grade}
            </span>
            <input
              type="number"
              step="0.01"
              name="Curricular_units_2nd_sem_grade"
              value={formData.Curricular_units_2nd_sem_grade}
              onChange={handleChange}
              min={0}
              max={20}
              placeholder="Ejemplo: 16.75"
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Unidades Aprobadas 1er Semestre</span>
            <span className="form-description">
              {variableDescriptions.Curricular_units_1st_sem_approved}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Curricular_units_1st_sem_grade}
            </span>
            <input
              type="number"
              step="0.01"
              name="Curricular_units_1st_sem_grade"
              value={formData.Curricular_units_1st_sem_grade}
              onChange={handleChange}
              min={0}
              max={20}
              placeholder="Ejemplo: 15.25"
              className="form-input"
            />
          </div>

          <div className="form-field">
            <span className="form-label">Matrícula al Día</span>
            <span className="form-description">
              {variableDescriptions.Tuition_fees_up_to_date}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Scholarship_holder}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Age_at_enrollment}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Debtor}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Gender}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Application_mode}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Unemployment_rate}
            </span>
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
            <span className="form-description">
              {variableDescriptions.Inflation_rate}
            </span>
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
            <span className="form-description">
              {variableDescriptions.GDP}
            </span>
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

      {/* VARIABLES DE SALUD MENTAL */}
      <div className="form-section section-critical">
        <h2 className="section-title">Variables de Salud Mental (Crítico)</h2>
        <div className="form-grid">
          <div className="form-field">
            <span className="form-label">Puntuación de Depresión (0-10)</span>
            <span className="form-description">
              {variableDescriptions.Depression_score}
            </span>
            <input
              type="number"
              step="0.1"
              name="Depression_score"
              value={formData.Depression_score}
              onChange={handleChange}
              min={0}
              max={10}
              placeholder="Ejemplo: 3.5"
              className="form-input"
            />
            <small className="field-hint">
              0 = Sin síntomas, 5-7 = Moderado, 7+ = Severo
            </small>
          </div>

          <div className="form-field">
            <span className="form-label">Puntuación de Ansiedad (0-10)</span>
            <span className="form-description">
              {variableDescriptions.Anxiety_score}
            </span>
            <input
              type="number"
              step="0.1"
              name="Anxiety_score"
              value={formData.Anxiety_score}
              onChange={handleChange}
              min={0}
              max={10}
              placeholder="Ejemplo: 4.2"
              className="form-input"
            />
            <small className="field-hint">
              0 = Sin síntomas, 5-7 = Moderado, 7+ = Severo
            </small>
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

      {/* Análisis de Factores de Riesgo */}
      {analisisFactores && (
        <div className="analysis-container">
          <h3 className="analysis-title">
            Análisis de Factores de Riesgo
            <span className={`attention-badge attention-${analisisFactores.nivel_atencion.toLowerCase()}`}>
              {analisisFactores.nivel_atencion}
            </span>
          </h3>
          
          {analisisFactores.factores_riesgo.length > 0 ? (
            <div className="factors-grid">
              {analisisFactores.factores_riesgo.map((factor, index) => (
                <div key={index} className={`factor-card impact-${factor.impacto.toLowerCase()}`}>
                  <div className="factor-header">
                    <span className="factor-name">{factor.factor}</span>
                    <span className={`factor-impact impact-${factor.impacto.toLowerCase()}`}>
                      {factor.impacto}
                    </span>
                  </div>
                  <p className="factor-description">{factor.descripcion}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-factors">No se identificaron factores de riesgo significativos</p>
          )}
        </div>
      )}

      {/* Recomendaciones */}
      {recomendaciones && recomendaciones.recomendaciones.length > 0 && (
        <div className="recommendations-container">
          <h3 className="recommendations-title">
            Recomendaciones de Intervención
            <span className="recommendations-count">
              {recomendaciones.total_recomendaciones} sugerencias
            </span>
          </h3>
          
          <div className="recommendations-grid">
            {recomendaciones.recomendaciones.map((rec, index) => (
              <div key={index} className={`recommendation-card priority-${rec.prioridad.toLowerCase()}`}>
                <div className="recommendation-header">
                  <span className="recommendation-type">{rec.tipo}</span>
                  <span className={`recommendation-priority priority-${rec.prioridad.toLowerCase()}`}>
                    {rec.prioridad}
                  </span>
                </div>
                <h4 className="recommendation-action">{rec.accion}</h4>
                <p className="recommendation-description">{rec.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
