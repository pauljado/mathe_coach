"use client";

import { useEffect, useMemo, useState } from "react";

import { lgsModes, lgsSizes, type AugmentedMatrix, type LgsChallengePayload, type LgsMode, type LgsSize } from "@/types/lgs";

type AttemptResponse = {
  xpAwarded: number;
  newTotalXp: number;
  newLevel: number;
  newBadges: Array<{ code: string; label: string; description: string }>;
};

type SizeFilter = "mixed" | LgsSize;

type HistoryEntry = {
  notation: string;
  matrix: AugmentedMatrix;
};

type PendingPair = { source: number; target: number };
type LgsOperationType = "combine" | "swap";

const EPSILON = 1e-6;

function isNearZero(value: number): boolean {
  return Math.abs(value) < EPSILON;
}

function deepCopy(matrix: AugmentedMatrix): AugmentedMatrix {
  return matrix.map((row) => [...row]);
}

function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

function formatNumber(value: number): string {
  const normalized = Math.abs(value) < EPSILON ? 0 : value;
  const rounded = Math.round(normalized);

  if (Math.abs(normalized - rounded) < EPSILON) {
    return String(rounded);
  }

  return String(Number(normalized.toFixed(3)));
}

function parseRationalInput(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) {
    return null;
  }

  const fractionMatch = normalized.match(
    /^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/
  );
  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || Math.abs(denominator) < EPSILON) {
      return null;
    }
    return numerator / denominator;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toRoman(rowIndex: number): string {
  const values = ["I", "II", "III", "IV", "V", "VI"];
  return values[rowIndex] ?? String(rowIndex + 1);
}

function countTargetZeros(matrix: AugmentedMatrix, mask: boolean[][]): number {
  let count = 0;

  for (let row = 0; row < mask.length; row += 1) {
    for (let col = 0; col < mask[row]!.length; col += 1) {
      if (!mask[row]![col]) {
        continue;
      }
      if (isNearZero(matrix[row]![col]!)) {
        count += 1;
      }
    }
  }

  return count;
}

function countTotalTargetCells(mask: boolean[][]): number {
  return mask.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}

function hasTargetEchelonZeros(matrix: AugmentedMatrix, mask: boolean[][]): boolean {
  for (let row = 0; row < mask.length; row += 1) {
    for (let col = 0; col < mask[row]!.length; col += 1) {
      if (mask[row]![col] && !isNearZero(matrix[row]![col]!)) {
        return false;
      }
    }
  }

  return true;
}

function hasNonZeroDiagonal(matrix: AugmentedMatrix, size: number): boolean {
  for (let index = 0; index < size; index += 1) {
    if (isNearZero(matrix[index]![index]!)) {
      return false;
    }
  }
  return true;
}

function activePivotIndex(matrix: AugmentedMatrix, mask: boolean[][]): number | null {
  for (let col = 0; col < mask.length; col += 1) {
    for (let row = col + 1; row < mask.length; row += 1) {
      if (mask[row]![col] && !isNearZero(matrix[row]![col]!)) {
        return col;
      }
    }
  }

  return null;
}

function applyCombineOperation(
  matrix: AugmentedMatrix,
  sourceRowIndex: number,
  targetRowIndex: number,
  sourceScale: number,
  targetScale: number,
  combineFactor: number
): AugmentedMatrix {
  const nextMatrix = deepCopy(matrix);
  const sourceRow = matrix[sourceRowIndex]!;
  const targetRow = matrix[targetRowIndex]!;
  nextMatrix[targetRowIndex] = targetRow.map((value, colIndex) =>
    Number((targetScale * value + combineFactor * (sourceScale * sourceRow[colIndex]!)).toFixed(6))
  );
  return nextMatrix;
}

function applySwapOperation(matrix: AugmentedMatrix, sourceRowIndex: number, targetRowIndex: number): AugmentedMatrix {
  const nextMatrix = deepCopy(matrix);
  [nextMatrix[sourceRowIndex], nextMatrix[targetRowIndex]] = [
    nextMatrix[targetRowIndex]!,
    nextMatrix[sourceRowIndex]!
  ];
  return nextMatrix;
}

function detectZeroTransitions(
  previousMatrix: AugmentedMatrix,
  nextMatrix: AugmentedMatrix,
  mask: boolean[][]
): { gained: string[]; destroyed: string[] } {
  const gained: string[] = [];
  const destroyed: string[] = [];

  for (let row = 0; row < mask.length; row += 1) {
    for (let col = 0; col < mask[row]!.length; col += 1) {
      if (!mask[row]![col]) {
        continue;
      }

      const previousZero = isNearZero(previousMatrix[row]![col]!);
      const nextZero = isNearZero(nextMatrix[row]![col]!);
      if (!previousZero && nextZero) {
        gained.push(cellKey(row, col));
      }
      if (previousZero && !nextZero) {
        destroyed.push(cellKey(row, col));
      }
    }
  }

  return { gained, destroyed };
}

function formatFactorForNotation(value: number): string {
  const normalized = formatNumber(value);
  return normalized === "1" ? "" : normalized === "-1" ? "-" : normalized;
}

function operationNotation(
  type: LgsOperationType,
  targetRowIndex: number,
  sourceRowIndex: number,
  sourceScale: number,
  targetScale: number,
  combineFactor: number
): string {
  const target = toRoman(targetRowIndex);
  const source = toRoman(sourceRowIndex);

  if (type === "swap") {
    return `${target} <-> ${source}`;
  }

  const scaledTarget = `${formatFactorForNotation(targetScale)}${target}`;
  const scaledSource = `${formatFactorForNotation(sourceScale)}${source}`;
  const combineSymbol = combineFactor >= 0 ? "+" : "-";
  const combineAbs = formatFactorForNotation(Math.abs(combineFactor));
  return `${target} <- ${scaledTarget} ${combineSymbol} ${combineAbs}${scaledSource}`;
}

function buildBackSubEquationText(
  matrix: AugmentedMatrix,
  rowIndex: number,
  size: number,
  variableNames: string[],
  solvedValues: Array<number | null>
): string {
  const row = matrix[rowIndex]!;
  const pieces: string[] = [];

  for (let col = rowIndex; col < size; col += 1) {
    const coefficient = row[col]!;
    if (isNearZero(coefficient)) {
      continue;
    }

    const sign = coefficient < 0 ? "-" : "+";
    const absCoeff = formatNumber(Math.abs(coefficient));
    let term = `${absCoeff}${variableNames[col]}`;

    if (col > rowIndex && solvedValues[col] !== null) {
      term += ` (${variableNames[col]}=${formatNumber(solvedValues[col]!)})`;
    }

    if (pieces.length === 0) {
      pieces.push(coefficient < 0 ? `-${term}` : term);
    } else {
      pieces.push(`${sign} ${term}`);
    }
  }

  const left = pieces.length > 0 ? pieces.join(" ") : "0";
  return `${left} = ${formatNumber(row[size]!)}`;
}

function computeBackSubTarget(
  matrix: AugmentedMatrix,
  rowIndex: number,
  size: number,
  solvedValues: Array<number | null>
): number | null {
  const row = matrix[rowIndex]!;
  const pivot = row[rowIndex]!;
  if (isNearZero(pivot)) {
    return null;
  }

  let rhs = row[size]!;
  for (let col = rowIndex + 1; col < size; col += 1) {
    const solved = solvedValues[col];
    if (solved === null) {
      return null;
    }
    rhs -= row[col]! * solved;
  }

  return rhs / pivot;
}

export default function LgsChallengePage() {
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("mixed");
  const [mode, setMode] = useState<LgsMode>("strategy");
  const [challenge, setChallenge] = useState<LgsChallengePayload | null>(null);
  const [matrix, setMatrix] = useState<AugmentedMatrix>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Lade Gauss-Aufgabe...");
  const [latestReward, setLatestReward] = useState<AttemptResponse | null>(null);

  const [selectedSourceRow, setSelectedSourceRow] = useState<number | null>(null);
  const [pendingPair, setPendingPair] = useState<PendingPair | null>(null);
  const [pendingOperationType, setPendingOperationType] = useState<LgsOperationType>("combine");
  const [pendingSourceScaleInput, setPendingSourceScaleInput] = useState("1");
  const [pendingTargetScaleInput, setPendingTargetScaleInput] = useState("1");
  const [pendingCombineFactorInput, setPendingCombineFactorInput] = useState("1");
  const [destroyWarningVisible, setDestroyWarningVisible] = useState(false);
  const [hardcoreEntryVisible, setHardcoreEntryVisible] = useState(false);
  const [hardcoreInputs, setHardcoreInputs] = useState<string[]>([]);
  const [hardcoreCheckError, setHardcoreCheckError] = useState(false);
  const [celebrationCells, setCelebrationCells] = useState<string[]>([]);
  const [dangerCells, setDangerCells] = useState<string[]>([]);

  const [phase, setPhase] = useState<"elimination" | "back-substitution" | "complete">("elimination");
  const [solvedValues, setSolvedValues] = useState<Array<number | null>>([]);
  const [activeBackRow, setActiveBackRow] = useState<number | null>(null);
  const [backInput, setBackInput] = useState("");
  const [backInsertError, setBackInsertError] = useState(false);
  const [flyMessage, setFlyMessage] = useState<string | null>(null);

  const totalTargetCells = useMemo(
    () => (challenge ? countTotalTargetCells(challenge.targetZeroMask) : 0),
    [challenge]
  );
  const completedTargetCells = useMemo(
    () => (challenge ? countTargetZeros(matrix, challenge.targetZeroMask) : 0),
    [challenge, matrix]
  );
  const pivotIndex = useMemo(
    () => (challenge && phase === "elimination" ? activePivotIndex(matrix, challenge.targetZeroMask) : null),
    [challenge, matrix, phase]
  );

  const pendingSourceScale = useMemo(
    () => parseRationalInput(pendingSourceScaleInput),
    [pendingSourceScaleInput]
  );
  const pendingTargetScale = useMemo(
    () => parseRationalInput(pendingTargetScaleInput),
    [pendingTargetScaleInput]
  );
  const pendingCombineFactor = useMemo(
    () => parseRationalInput(pendingCombineFactorInput),
    [pendingCombineFactorInput]
  );

  const previewMatrix = useMemo(() => {
    if (!pendingPair || matrix.length === 0) {
      return null;
    }

    if (pendingOperationType === "swap") {
      return applySwapOperation(matrix, pendingPair.source, pendingPair.target);
    }

    if (
      pendingSourceScale === null ||
      pendingTargetScale === null ||
      pendingCombineFactor === null
    ) {
      return null;
    }

    return applyCombineOperation(
      matrix,
      pendingPair.source,
      pendingPair.target,
      pendingSourceScale,
      pendingTargetScale,
      pendingCombineFactor
    );
  }, [
    matrix,
    pendingCombineFactor,
    pendingOperationType,
    pendingPair,
    pendingSourceScale,
    pendingTargetScale
  ]);

  const previewRow = useMemo(() => {
    if (!previewMatrix || !pendingPair) {
      return null;
    }
    return previewMatrix[pendingPair.target] ?? null;
  }, [pendingPair, previewMatrix]);

  function resetOperationPanel() {
    setPendingPair(null);
    setPendingOperationType("combine");
    setPendingSourceScaleInput("1");
    setPendingTargetScaleInput("1");
    setPendingCombineFactorInput("1");
    setDestroyWarningVisible(false);
    setHardcoreEntryVisible(false);
    setHardcoreInputs([]);
    setHardcoreCheckError(false);
  }

  function setPhaseForMatrix(nextMatrix: AugmentedMatrix) {
    if (!challenge) {
      return;
    }

    const echelonReached = hasTargetEchelonZeros(nextMatrix, challenge.targetZeroMask);
    const diagonalReady = hasNonZeroDiagonal(nextMatrix, challenge.size);
    const resetSolved = Array.from({ length: challenge.size }, () => null);

    if (echelonReached && diagonalReady) {
      setPhase("back-substitution");
      setActiveBackRow(challenge.size - 1);
      setSolvedValues(resetSolved);
      setBackInput("");
      setBackInsertError(false);
      setFlyMessage(null);
      setStatus("Stufenform erreicht. Starte jetzt das Rueckwaertseinsetzen.");
      return;
    }

    if (echelonReached && !diagonalReady) {
      setPhase("elimination");
      setActiveBackRow(null);
      setSolvedValues(resetSolved);
      setBackInput("");
      setBackInsertError(false);
      setFlyMessage(null);
      setStatus(
        "Unteres Dreieck ist null, aber ein Pivot auf der Diagonale ist 0. Nutze Tausch oder Skalierung."
      );
      return;
    }

    setPhase("elimination");
    setActiveBackRow(null);
    setSolvedValues(resetSolved);
    setBackInput("");
    setBackInsertError(false);
    setFlyMessage(null);
  }

  function initializeChallenge(payload: LgsChallengePayload) {
    const initial = deepCopy(payload.initialMatrix);
    setChallenge(payload);
    setMatrix(initial);
    setHistory([{ notation: "Ausgangsmatrix", matrix: deepCopy(initial) }]);
    setHistoryIndex(0);
    setSelectedSourceRow(null);
    resetOperationPanel();
    setPhase("elimination");
    setSolvedValues(Array.from({ length: payload.size }, () => null));
    setActiveBackRow(null);
    setBackInput("");
    setBackInsertError(false);
    setFlyMessage(null);
  }

  function pulseBackInsertError() {
    setBackInsertError(true);
    window.setTimeout(() => setBackInsertError(false), 550);
  }

  function pulseHardcoreCheckError() {
    setHardcoreCheckError(true);
    window.setTimeout(() => setHardcoreCheckError(false), 550);
  }

  async function loadNextChallenge(filter: SizeFilter) {
    setLoading(true);
    setStatus("Lade Gauss-Aufgabe...");

    const query = filter === "mixed" ? "" : `?size=${filter}`;
    const response = await fetch(`/api/challenge/lgs/next${query}`, { method: "GET" });
    const payload = (await response.json()) as LgsChallengePayload;

    initializeChallenge(payload);
    setLoading(false);
    setStatus(`${payload.matrixLabel} bereit. Ziehe eine Zeile auf eine andere, um zu starten.`);
  }

  useEffect(() => {
    void loadNextChallenge(sizeFilter);
  }, [sizeFilter]);

  function handleRowSelect(source: number, target: number) {
    if (source === target || loading || phase !== "elimination") {
      return;
    }

    setPendingPair({ source, target });
    setPendingOperationType("combine");
    setPendingSourceScaleInput("1");
    setPendingTargetScaleInput("1");
    setPendingCombineFactorInput("1");
    setDestroyWarningVisible(false);
    setHardcoreEntryVisible(false);
    setHardcoreInputs([]);
    setStatus(`Operation gewaehlt: ${toRoman(target)} und ${toRoman(source)}. Vorschau pruefen.`);
  }

  function commitOperation(nextMatrix: AugmentedMatrix, gained: string[], destroyed: string[]) {
    if (!pendingPair) {
      return;
    }

    if (
      pendingOperationType === "combine" &&
      (pendingSourceScale === null || pendingTargetScale === null || pendingCombineFactor === null)
    ) {
      return;
    }

    const truncatedHistory = history.slice(0, historyIndex + 1);
    const notation = operationNotation(
      pendingOperationType,
      pendingPair.target,
      pendingPair.source,
      pendingSourceScale ?? 1,
      pendingTargetScale ?? 1,
      pendingCombineFactor ?? 1
    );
    const nextHistory = [...truncatedHistory, { notation, matrix: deepCopy(nextMatrix) }];

    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setMatrix(nextMatrix);
    setSelectedSourceRow(null);
    resetOperationPanel();

    if (gained.length > 0) {
      setCelebrationCells(gained);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(45);
      }
      window.setTimeout(() => setCelebrationCells([]), 900);
    }

    if (pendingOperationType !== "swap" && destroyed.length > 0) {
      setDangerCells(destroyed);
      window.setTimeout(() => setDangerCells([]), 1100);
    } else {
      setDangerCells([]);
    }

    setPhaseForMatrix(nextMatrix);
    if (gained.length > 0) {
      setStatus(`Nullen-Party: ${gained.length} Zielzelle(n) wurden zu 0.`);
    } else {
      setStatus(`${notation} angewendet.`);
    }
  }

  function verifyAndCommitFromMenu(forceDestroy = false) {
    if (!challenge || !pendingPair) {
      return;
    }

    if (pendingOperationType === "combine") {
      if (
        pendingSourceScale === null ||
        pendingTargetScale === null ||
        pendingCombineFactor === null
      ) {
        setStatus("Ungueltiger Faktor. Erlaubt: ganze Zahl, Dezimalzahl oder Bruch wie -1/2.");
        return;
      }

      if (Math.abs(pendingTargetScale) < EPSILON) {
        setStatus("Der Ziel-Skalierungsfaktor a darf nicht 0 sein.");
        return;
      }
    }

    if (!previewMatrix) {
      return;
    }

    const transitions = detectZeroTransitions(matrix, previewMatrix, challenge.targetZeroMask);
    if (pendingOperationType !== "swap" && transitions.destroyed.length > 0 && !forceDestroy) {
      setDestroyWarningVisible(true);
      setDangerCells(transitions.destroyed);
      setStatus("Vorsicht: diese Operation zerstoert bereits erreichte Nullen. Bist du sicher?");
      return;
    }

    if (mode === "hardcore" && !hardcoreEntryVisible) {
      setHardcoreEntryVisible(true);
      setHardcoreInputs(previewMatrix[pendingPair.target]!.map(() => ""));
      setStatus("Selbst-rechnen-Modus: gib die neue Zielzeile selbst ein.");
      return;
    }

    commitOperation(previewMatrix, transitions.gained, transitions.destroyed);
  }

  function verifyHardcoreInputsAndCommit() {
    if (!pendingPair || !previewRow) {
      return;
    }

    if (hardcoreInputs.length !== previewRow.length) {
      return;
    }

    for (let index = 0; index < previewRow.length; index += 1) {
      const parsed = parseRationalInput(hardcoreInputs[index] ?? "");
      if (parsed === null || Math.abs(parsed - previewRow[index]!) > 1e-4) {
        pulseHardcoreCheckError();
        setStatus(
          `Selbstrechnen-Pruefung fehlgeschlagen in Spalte ${index + 1}. Erwartet ${formatNumber(previewRow[index]!)}, erhalten ${hardcoreInputs[index] || "leer"}.`
        );
        return;
      }
    }

    setHardcoreCheckError(false);
    verifyAndCommitFromMenu(true);
  }

  function jumpToHistory(index: number) {
    if (index < 0 || index >= history.length || !challenge) {
      return;
    }

    const snapshot = deepCopy(history[index]!.matrix);
    setHistoryIndex(index);
    setMatrix(snapshot);
    setSelectedSourceRow(null);
    resetOperationPanel();
    setCelebrationCells([]);
    setDangerCells([]);
    setPhaseForMatrix(snapshot);
    setStatus(`Zu Schritt ${index} zurueckgespult: ${history[index]!.notation}.`);
  }

  function submitBackSubValue() {
    if (!challenge || activeBackRow === null || phase !== "back-substitution") {
      return;
    }

    const parsed = parseRationalInput(backInput);
    if (parsed === null) {
      setStatus("Bitte einen gueltigen Zahlenwert oder Bruch eingeben.");
      return;
    }

    const expected = computeBackSubTarget(matrix, activeBackRow, challenge.size, solvedValues);
    if (expected === null) {
      setStatus("Diese Zeile kann nicht berechnet werden, da Pivot oder Folgewert fehlt.");
      return;
    }

    if (Math.abs(parsed - expected) > 1e-4) {
      pulseBackInsertError();
      setStatus(`Noch nicht korrekt. Erwartet: ${formatNumber(expected)} fuer ${challenge.variableNames[activeBackRow]}.`);
      return;
    }

    const nextSolved = [...solvedValues];
    nextSolved[activeBackRow] = Number(parsed.toFixed(6));
    setSolvedValues(nextSolved);
    setBackInput("");
    setBackInsertError(false);

    if (activeBackRow > 0) {
      const currentVariable = challenge.variableNames[activeBackRow];
      setFlyMessage(`${currentVariable} = ${formatNumber(parsed)} wurde nach oben eingesetzt.`);
      window.setTimeout(() => setFlyMessage(null), 1200);
      setActiveBackRow(activeBackRow - 1);
      setStatus(`Korrekt. Weiter mit Zeile ${toRoman(activeBackRow - 1)}.`);
      return;
    }

    setActiveBackRow(null);
    setPhase("complete");
    setStatus("Rueckwaertseinsetzen abgeschlossen. Jetzt als korrekt einreichen.");
  }

  async function submitAttempt(isCorrect: boolean) {
    if (!challenge) {
      return;
    }

    setLoading(true);
    const solvedPayload = solvedValues.map(
      (value, index) => value ?? challenge.solution[index] ?? 0
    );

    const response = await fetch("/api/challenge/lgs/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        challengeId: challenge.challengeId,
        matrixLabel: challenge.matrixLabel,
        systemSize: challenge.size,
        mode,
        operationCount: Math.max(0, historyIndex),
        solvedValues: solvedPayload,
        isCorrect
      })
    });

    const reward = (await response.json()) as AttemptResponse;
    setLatestReward(reward);

    await loadNextChallenge(sizeFilter);
    setStatus(isCorrect ? "Als korrekt markiert. Neues System geladen." : "Als falsch markiert. Neues System geladen.");
  }

  return (
    <section className="grid" style={{ gap: "1rem" }}>
      <div className="card challenge-shell lgs-shell">
        <div className="challenge-top-row">
          <h1>Interaktiver Gauss-Trainer</h1>

          <div className="lgs-controls">
            <label>
              <span className="muted">Systemgroesse</span>
              <br />
              <select
                value={String(sizeFilter)}
                onChange={(event) =>
                  setSizeFilter(
                    event.target.value === "mixed" ? "mixed" : (Number(event.target.value) as LgsSize)
                  )
                }
                aria-label="Matrixgroesse waehlen"
              >
                <option value="mixed">Gemischt (3x3 / 4x4)</option>
                {lgsSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}x{size}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="muted">Modus</span>
              <br />
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as LgsMode)}
                aria-label="Modus waehlen"
              >
                {lgsModes.map((item) => (
                  <option key={item} value={item}>
                    {item === "strategy" ? "Strategie (App rechnet)" : "Selbst rechnen"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="muted">
          Ziel: Jage die Nullen im unteren Dreieck. Ziehe eine Quellzeile auf eine Zielzeile und kombiniere sie.
        </p>
        {challenge ? (
          <p className="muted">
            {challenge.matrixLabel} | Ziel-Nullen: {completedTargetCells}/{totalTargetCells}
          </p>
        ) : null}

        <div className="lgs-layout">
          <div className="lgs-matrix-stage" role="region" aria-label="Erweiterte Matrix">
            <div className="lgs-bracket lgs-bracket-left" aria-hidden="true" />
            <div className="lgs-matrix">
              {matrix.map((row, rowIndex) => (
                <div
                  key={`row-${rowIndex}`}
                  className={`lgs-row ${selectedSourceRow === rowIndex ? "lgs-row-selected" : ""}`}
                  style={{
                    gridTemplateColumns: `34px repeat(${challenge ? challenge.size + 1 : 5}, minmax(0, 1fr))`
                  }}
                  draggable={!loading && phase === "elimination"}
                  onDragStart={() => setSelectedSourceRow(rowIndex)}
                  onDragEnd={() => setSelectedSourceRow(null)}
                  onDragOver={(event) => {
                    if (phase === "elimination" && selectedSourceRow !== null && selectedSourceRow !== rowIndex) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (selectedSourceRow !== null) {
                      handleRowSelect(selectedSourceRow, rowIndex);
                      setSelectedSourceRow(null);
                    }
                  }}
                  onClick={() => {
                    if (loading || phase !== "elimination") {
                      return;
                    }

                    if (selectedSourceRow === null) {
                      setSelectedSourceRow(rowIndex);
                      setStatus(`Quellzeile ${toRoman(rowIndex)} gewaehlt. Zielzeile auswaehlen.`);
                      return;
                    }

                    if (selectedSourceRow === rowIndex) {
                      setSelectedSourceRow(null);
                      return;
                    }

                    handleRowSelect(selectedSourceRow, rowIndex);
                    setSelectedSourceRow(null);
                  }}
                >
                  <div className="lgs-row-label">{toRoman(rowIndex)}</div>
                  {row.map((value, colIndex) => {
                    const targetCell =
                      challenge && colIndex < challenge.size
                        ? challenge.targetZeroMask[rowIndex]?.[colIndex]
                        : false;
                    const key = cellKey(rowIndex, colIndex);
                    const pivotCell = pivotIndex !== null && rowIndex === pivotIndex && colIndex === pivotIndex;
                    const rhsCell = challenge ? colIndex === challenge.size : false;
                    const className = [
                      "lgs-cell",
                      targetCell ? "lgs-cell-target" : "",
                      rhsCell ? "lgs-cell-rhs" : "",
                      celebrationCells.includes(key) ? "lgs-cell-good" : "",
                      dangerCells.includes(key) ? "lgs-cell-bad" : "",
                      pivotCell ? "lgs-cell-pivot" : ""
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div key={`cell-${rowIndex}-${colIndex}`} className={className}>
                        <span>{formatNumber(value)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="lgs-bracket lgs-bracket-right" aria-hidden="true" />
          </div>

          <aside className="card lgs-history-card">
            <h2>Verlauf / Rueckgaengig</h2>
            <p className="muted">Klicke auf einen Schritt, um visuell zurueckzuspulen.</p>
            <ol className="lgs-history-list">
              {history.map((entry, index) => (
                <li key={`history-${index}`}>
                  <button
                    type="button"
                    className={`lgs-history-btn ${index === historyIndex ? "lgs-history-btn-active" : ""}`}
                    onClick={() => jumpToHistory(index)}
                    disabled={loading}
                  >
                    {index === 0 ? "Startzustand" : `${index}. ${entry.notation}`}
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        {pendingPair ? (
          <div className="card lgs-operator-card">
            <h2>Zeilenoperation</h2>
            <p className="muted">
              Quelle: {toRoman(pendingPair.source)} | Ziel: {toRoman(pendingPair.target)}
            </p>
            <label className="lgs-factor-input">
              <span>Operationstyp</span>
              <select
                value={pendingOperationType}
                onChange={(event) => setPendingOperationType(event.target.value as LgsOperationType)}
                aria-label="Operationstyp waehlen"
              >
                <option value="combine">Kombinieren (skalierbar)</option>
                <option value="swap">Zeilen tauschen</option>
              </select>
            </label>

            {pendingOperationType === "combine" ? (
              <>
                <p className="muted">
                  {toRoman(pendingPair.target)} &larr; a*{toRoman(pendingPair.target)} + k*(b*
                  {toRoman(pendingPair.source)})
                </p>
                <div className="lgs-factor-grid">
                  <label className="lgs-factor-input">
                    <span>a (Skalierung Zielzeile, a != 0)</span>
                    <input
                      type="text"
                      value={pendingTargetScaleInput}
                      onChange={(event) => setPendingTargetScaleInput(event.target.value)}
                      placeholder="z.B. 1 oder 1/2"
                    />
                  </label>
                  <label className="lgs-factor-input">
                    <span>b (Skalierung Quellzeile)</span>
                    <input
                      type="text"
                      value={pendingSourceScaleInput}
                      onChange={(event) => setPendingSourceScaleInput(event.target.value)}
                      placeholder="z.B. 1 oder -3/2"
                    />
                  </label>
                  <label className="lgs-factor-input">
                    <span>k (Kombinationsfaktor)</span>
                    <input
                      type="text"
                      value={pendingCombineFactorInput}
                      onChange={(event) => setPendingCombineFactorInput(event.target.value)}
                      placeholder="z.B. -1/2"
                    />
                  </label>
                </div>
              </>
            ) : (
              <p className="muted">
                {toRoman(pendingPair.target)} &harr; {toRoman(pendingPair.source)}
              </p>
            )}

            {mode === "strategy" ? (
              <p className="muted">
                Vorschau ({toRoman(pendingPair.target)}):{" "}
                {previewRow ? previewRow.map((item) => formatNumber(item)).join(", ") : "ungueltige Faktor-Eingabe"}
              </p>
            ) : (
              <p className="muted">
                Vorschau im Selbst-rechnen-Modus deaktiviert.
              </p>
            )}

            {destroyWarningVisible ? (
              <p className="lgs-warning">
                Vorsicht! Du zerstoerst bereits erreichte Nullen. Nutze "Trotzdem anwenden" nur wenn du sicher bist.
              </p>
            ) : null}

            {mode === "hardcore" && hardcoreEntryVisible && previewRow ? (
              <div className="lgs-hardcore-box">
                <h3>Selbst-Eingabe</h3>
                <p className="muted">Gib vor dem Anwenden die komplette Zielzeile selbst ein.</p>
                <div className="lgs-hardcore-grid">
                  {previewRow.map((_, colIndex) => (
                    <input
                      key={`hardcore-${colIndex}`}
                      type="text"
                      value={hardcoreInputs[colIndex] ?? ""}
                      onChange={(event) => {
                        const next = [...hardcoreInputs];
                        next[colIndex] = event.target.value;
                        setHardcoreInputs(next);
                      }}
                      aria-label={`Wert Spalte ${colIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="actions-row">
              {mode === "hardcore" && hardcoreEntryVisible ? (
                <button
                  type="button"
                  className={`btn btn-primary lgs-back-insert-btn ${hardcoreCheckError ? "lgs-back-insert-btn-error" : ""}`}
                  onClick={verifyHardcoreInputsAndCommit}
                >
                  Pruefen & Anwenden
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => verifyAndCommitFromMenu(false)}>
                  Operation anwenden
                </button>
              )}

              {destroyWarningVisible ? (
                <button type="button" className="btn btn-danger" onClick={() => verifyAndCommitFromMenu(true)}>
                  Trotzdem anwenden
                </button>
              ) : null}

              <button type="button" className="btn btn-outline" onClick={resetOperationPanel}>
                Abbrechen
              </button>
            </div>
          </div>
        ) : null}

        {(phase === "back-substitution" || phase === "complete") && challenge ? (
          <div className="card lgs-backsub-card">
            <h2>Rueckwaertseinsetzen</h2>

            {phase === "back-substitution" && activeBackRow !== null ? (
              <>
                <p className="muted">Aktive Zeile: {toRoman(activeBackRow)}</p>
                <p className="lgs-equation">
                  {buildBackSubEquationText(
                    matrix,
                    activeBackRow,
                    challenge.size,
                    challenge.variableNames,
                    solvedValues
                  )}
                </p>
                <label className="lgs-back-input">
                  <span>Wert fuer {challenge.variableNames[activeBackRow]} eingeben</span>
                  <input
                    type="text"
                    value={backInput}
                    onChange={(event) => setBackInput(event.target.value)}
                    aria-label={`Wert fuer ${challenge.variableNames[activeBackRow]} eingeben`}
                  />
                </label>
                <div className="actions-row">
                  <button
                    type="button"
                    className={`btn btn-primary lgs-back-insert-btn ${backInsertError ? "lgs-back-insert-btn-error" : ""}`}
                    onClick={submitBackSubValue}
                  >
                    Einsetzen
                  </button>
                </div>
              </>
            ) : null}

            {phase === "complete" ? (
              <p className="result-good">
                Loesung:{" "}
                {challenge.variableNames
                  .map((name, index) => `${name}=${formatNumber(solvedValues[index] ?? 0)}`)
                  .join(", ")}
              </p>
            ) : null}

            {flyMessage ? <p className="lgs-fly-note">{flyMessage}</p> : null}
          </div>
        ) : null}

        <div className="actions-row">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => void submitAttempt(true)}
            disabled={loading || phase !== "complete"}
          >
            Korrekt einreichen
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => void submitAttempt(false)}
            disabled={loading}
          >
            Ueberspringen / Falsch einreichen
          </button>
        </div>
      </div>

      {latestReward ? (
        <div className="card reward-card" aria-live="polite">
          <p>
            +{latestReward.xpAwarded} XP erhalten. Level {latestReward.newLevel}, insgesamt {latestReward.newTotalXp} XP.
          </p>
          {latestReward.newBadges.length > 0 ? (
            <p>Neue Badges: {latestReward.newBadges.map((badge) => badge.label).join(", ")}</p>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
