import { useState } from "react";
import "./AnalisisMasivo.css";

interface Estudiante {
  id_estudiante: string;
  Marital_status: number;
  Application_mode: number;
  Application_order: number;
  Course: number;
  Daytime_evening_attendance: number;
  Previous_qualification: number;
  Nacionality: number;
  Mothers_qualification: number;
  Fathers_qualification: number;
  Mothers_occupation: number;
  Fathers_occupation: number;
  Displaced: number;
  Educational_special_needs: number;
  Debtor: number;
  Tuition_fees_up_to_date: number;
  Gender: number;
  Scholarship_holder: number;
  Age_at_enrollment: number;
  International: number;
  Curricular_units_1st_sem_credited: number;
  Curricular_units_1st_sem_enrolled: number;
  Curricular_units_1st_sem_evaluations: number;
  Curricular_units_1st_sem_approved: number;
  Curricular_units_1st_sem_grade: number;
  Curricular_units_1st_sem_without_evaluations: number;
  Curricular_units_2nd_sem_credited: number;
  Curricular_units_2nd_sem_enrolled: number;
  Curricular_units_2nd_sem_evaluations: number;
  Curricular_units_2nd_sem_approved: number;
  Curricular_units_2nd_sem_grade: number;
  Curricular_units_2nd_sem_without_evaluations: number;
  Unemployment_rate: number;
  Inflation_rate: number;
  GDP: number;
}

interface PrediccionLote {
  id_estudiante: string;
  resultado: string;
  probabilidad_abandono: number;
  probabilidad_graduacion: number;
}

interface ResultadoLote {
  usuario: string;
  total_estudiantes: number;
  estudiantes_en_riesgo: number;
  porcentaje_riesgo: number;
  predicciones: PrediccionLote[];
}

interface EstudianteRiesgo {
  id_estudiante: string;
  probabilidad_abandono: number;
  nivel_riesgo: string;
  carrera: number;
  beca: string;
  deudor: string;
}

interface ResultadoRiesgo {
  usuario: string;
  umbral_riesgo: number;
  total_analizados: number;
  total_alto_riesgo: number;
  porcentaje_alto_riesgo: number;
  estudiantes_alto_riesgo: EstudianteRiesgo[];
}

interface AnalisisCarrera {
  carrera: number;
  total_estudiantes: number;
  estudiantes_en_riesgo: number;
  estudiantes_graduados: number;
  porcentaje_riesgo: number;
  promedio_probabilidad_abandono: number;
}

interface ResultadoCarrera {
  usuario: string;
  total_carreras: number;
  analisis_por_carrera: AnalisisCarrera[];
}

export default function AnalisisMasivo() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [resultadoLote, setResultadoLote] = useState<ResultadoLote | null>(null);
  const [resultadoRiesgo, setResultadoRiesgo] = useState<ResultadoRiesgo | null>(null);
  const [resultadoCarrera, setResultadoCarrera] = useState<ResultadoCarrera | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [umbralRiesgo, setUmbralRiesgo] = useState(0.6);

  console.log("🎯 Componente AnalisisMasivo renderizado");
  console.log("📚 Estudiantes cargados:", estudiantes.length);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    console.log("🔍 Evento de carga activado");
    console.log("📁 Archivo seleccionado:", file);
    
    if (!file) {
      console.log("❌ No hay archivo");
      return;
    }

    console.log("✅ Procesando archivo:", file.name);
    const reader = new FileReader();
    
    reader.onerror = (error) => {
      console.error("❌ Error al leer archivo:", error);
      setError("Error al leer el archivo");
    };
    
    reader.onload = (event) => {
      try {
        console.log("📖 Archivo cargado, procesando...");
        const text = event.target?.result as string;
        console.log("📝 Primeras 200 caracteres:", text.substring(0, 200));
        
        const lines = text.split("\n");
        console.log("📊 Total de líneas:", lines.length);
        
        const headers = lines[0].split(",").map((h) => h.trim());
        console.log("🏷️ Headers encontrados:", headers);

        const estudiantesData: Estudiante[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(",");
          const estudiante: any = {};

          headers.forEach((header, index) => {
            const value = values[index]?.trim();
            if (header === "id_estudiante") {
              estudiante[header] = value;
            } else {
              estudiante[header] = parseFloat(value) || 0;
            }
          });

          estudiantesData.push(estudiante as Estudiante);
        }

        console.log("✅ Estudiantes procesados:", estudiantesData.length);
        console.log("👤 Primer estudiante:", estudiantesData[0]);
        
        setEstudiantes(estudiantesData);
        setError(null);
      } catch (err: any) {
        console.error("❌ Error al procesar CSV:", err);
        setError("Error al procesar el archivo CSV: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("📦 Archivo soltado");
    const file = e.dataTransfer.files?.[0];
    
    if (file && file.name.endsWith('.csv')) {
      console.log("✅ Archivo CSV válido:", file.name);
      // Crear un evento simulado para reutilizar handleFileUpload
      const event = {
        target: {
          files: [file]
        }
      } as any;
      handleFileUpload(event);
    } else {
      console.log("❌ Archivo no válido");
      setError("Por favor, suelta un archivo CSV");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const analizarLote = async () => {
    if (estudiantes.length === 0) {
      setError("Primero carga un archivo CSV con estudiantes");
      return;
    }

    setCargando(true);
    setError(null);
    setResultadoLote(null);
    setResultadoRiesgo(null);
    setResultadoCarrera(null);

    try {
      const authHeader = "Basic " + btoa("admin:12345");
      const headers = {
        "Content-Type": "application/json",
        Authorization: authHeader,
      };

      // Análisis 1: Predicción en lote
      const responseLote = await fetch("https://desercion_api.quods.xyz/predecir/lote", {
        method: "POST",
        headers,
        body: JSON.stringify({ estudiantes }),
      });

      if (responseLote.ok) {
        const dataLote: ResultadoLote = await responseLote.json();
        setResultadoLote(dataLote);
      }

      // Análisis 2: Estudiantes de alto riesgo
      const responseRiesgo = await fetch(
        `https://desercion_api.quods.xyz/analizar/riesgo?umbral_riesgo=${umbralRiesgo}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ estudiantes }),
        }
      );

      if (responseRiesgo.ok) {
        const dataRiesgo: ResultadoRiesgo = await responseRiesgo.json();
        setResultadoRiesgo(dataRiesgo);
      }

      // Análisis 3: Por carrera
      const responseCarrera = await fetch("https://desercion_api.quods.xyz/analizar/por-carrera", {
        method: "POST",
        headers,
        body: JSON.stringify({ estudiantes }),
      });

      if (responseCarrera.ok) {
        const dataCarrera: ResultadoCarrera = await responseCarrera.json();
        setResultadoCarrera(dataCarrera);
      }
    } catch (err: any) {
      setError("Error al analizar: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="masivo-container">
      <h1 className="masivo-title">Análisis Masivo de Estudiantes</h1>

      {/* Carga de archivo */}
      <div className="upload-section">
        <h2 className="section-title">1. Cargar Datos</h2>
        <div className="upload-card">
          <div 
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              id="csv-upload"
              style={{ display: 'none' }}
            />
            
            <div className="drop-zone-content">
              <div className="drop-zone-icon">📁</div>
              <p className="drop-zone-title">Arrastra tu archivo CSV aquí</p>
              <p className="drop-zone-subtitle">o</p>
              <button 
                onClick={() => {
                  console.log("🔵 Botón clickeado");
                  const input = document.getElementById('csv-upload') as HTMLInputElement;
                  if (input) {
                    console.log("✅ Input encontrado, abriendo selector");
                    input.click();
                  } else {
                    console.log("❌ Input NO encontrado");
                  }
                }}
                className="file-button"
                type="button"
              >
                Seleccionar archivo
              </button>
              <p className="drop-zone-help">Formato: CSV (máx. 10MB)</p>
            </div>
          </div>

          {estudiantes.length > 0 && (
            <div className="file-info">
              <p className="file-count">
                ✓ {estudiantes.length} estudiantes cargados
              </p>
            </div>
          )}

          <div className="upload-instructions">
            <h4>Formato del CSV:</h4>
            <p>El archivo debe incluir las siguientes columnas:</p>
            <code className="csv-example">
              id_estudiante,Marital_status,Application_mode,Course,...
            </code>
            <p className="note">
              Primera fila: nombres de columnas. Siguientes filas: datos de estudiantes.
            </p>
            <a 
              href="/ejemplo_estudiantes.csv" 
              download="ejemplo_estudiantes.csv"
              className="download-example"
            >
              📥 Descargar CSV de ejemplo
            </a>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="config-section">
        <h2 className="section-title">2. Configurar Análisis</h2>
        <div className="config-card">
          <label className="config-label">
            Umbral de Riesgo Alto:
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={umbralRiesgo}
              onChange={(e) => setUmbralRiesgo(parseFloat(e.target.value))}
              className="config-input"
            />
            <span className="config-help">
              ({(umbralRiesgo * 100).toFixed(0)}% probabilidad de abandono)
            </span>
          </label>
        </div>
      </div>

      {/* Botón de análisis */}
      <button
        onClick={analizarLote}
        disabled={cargando || estudiantes.length === 0}
        className="analyze-button"
      >
        {cargando ? "Analizando..." : "Analizar Estudiantes"}
      </button>

      {/* Error */}
      {error && (
        <div className="error-container">
          <p className="error-title">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Resultados */}
      {resultadoLote && (
        <div className="results-section">
          <h2 className="section-title">Resumen General</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{resultadoLote.total_estudiantes}</div>
              <div className="stat-label">Total Estudiantes</div>
            </div>
            <div className="stat-card stat-danger">
              <div className="stat-value">{resultadoLote.estudiantes_en_riesgo}</div>
              <div className="stat-label">En Riesgo</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-value">{resultadoLote.porcentaje_riesgo}%</div>
              <div className="stat-label">% Riesgo</div>
            </div>
          </div>
        </div>
      )}

      {/* Estudiantes de Alto Riesgo */}
      {resultadoRiesgo && resultadoRiesgo.estudiantes_alto_riesgo.length > 0 && (
        <div className="risk-section">
          <h2 className="section-title">
            Estudiantes de Alto Riesgo ({resultadoRiesgo.total_alto_riesgo})
          </h2>
          <div className="table-container">
            <table className="risk-table">
              <thead>
                <tr>
                  <th>ID Estudiante</th>
                  <th>Nivel</th>
                  <th>Prob. Abandono</th>
                  <th>Carrera</th>
                  <th>Beca</th>
                  <th>Deudor</th>
                </tr>
              </thead>
              <tbody>
                {resultadoRiesgo.estudiantes_alto_riesgo.map((est, index) => (
                  <tr key={index}>
                    <td>{est.id_estudiante}</td>
                    <td>
                      <span className={`nivel-badge nivel-${est.nivel_riesgo.toLowerCase()}`}>
                        {est.nivel_riesgo}
                      </span>
                    </td>
                    <td className="prob-cell">{(est.probabilidad_abandono * 100).toFixed(1)}%</td>
                    <td>{est.carrera}</td>
                    <td>{est.beca}</td>
                    <td>{est.deudor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Análisis por Carrera */}
      {resultadoCarrera && (
        <div className="career-section">
          <h2 className="section-title">
            Análisis por Carrera ({resultadoCarrera.total_carreras} carreras)
          </h2>
          <div className="table-container">
            <table className="career-table">
              <thead>
                <tr>
                  <th>Carrera</th>
                  <th>Total</th>
                  <th>En Riesgo</th>
                  <th>Graduados</th>
                  <th>% Riesgo</th>
                  <th>Prob. Promedio</th>
                </tr>
              </thead>
              <tbody>
                {resultadoCarrera.analisis_por_carrera.map((carrera, index) => (
                  <tr key={index} className={carrera.porcentaje_riesgo > 50 ? "high-risk-row" : ""}>
                    <td className="career-id">{carrera.carrera}</td>
                    <td>{carrera.total_estudiantes}</td>
                    <td className="risk-cell">{carrera.estudiantes_en_riesgo}</td>
                    <td className="grad-cell">{carrera.estudiantes_graduados}</td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${carrera.porcentaje_riesgo}%` }}
                        />
                        <span className="progress-text">{carrera.porcentaje_riesgo}%</span>
                      </div>
                    </td>
                    <td>{(carrera.promedio_probabilidad_abandono * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
