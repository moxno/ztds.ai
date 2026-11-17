'use strict';

const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const {
  sanitizeText,
  restoreText,
  auditDocumentLines,
  mergeVscodeMcpConfig,
  resetSession,
  getSessionTokenCount
} = require('./core');

let statusBarItem;
let diagnosticCollection;
let outputChannel;

function updateStatusBar() {
  if (!statusBarItem) return;
  const count = getSessionTokenCount('default');
  statusBarItem.text = `$(shield) ZTDS: ${count} token${count === 1 ? '' : 's'}`;
}

async function handleSanitizeSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('ZTDS Guard: Open a file or select text to sanitize in volatile RAM.');
    return;
  }

  const selection = editor.selection.isEmpty
    ? new vscode.Range(0, 0, Math.max(0, editor.document.lineCount - 1), editor.document.lineAt(Math.max(0, editor.document.lineCount - 1)).text.length)
    : editor.selection;

  const original = editor.document.getText(selection);
  const result = sanitizeText(original, 'default');

  if (result.sanitizedText !== original) {
    await editor.edit((editBuilder) => {
      editBuilder.replace(selection, result.sanitizedText);
    });
  }

  updateStatusBar();
  outputChannel.appendLine(`[SANITIZE] Masked ${result.entitiesMasked} new entities (${result.categories.join(', ') || 'none'}) | Receipt: ${result.auditReceipt}`);
  vscode.window.showInformationMessage(`ZTDS Guard: Sanitized (${result.entitiesMasked} new tokens) — ${result.auditReceipt}`);
}

async function handleRestoreSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('ZTDS Guard: Open a file containing surrogate tokens to restore.');
    return;
  }

  const selection = editor.selection.isEmpty
    ? new vscode.Range(0, 0, Math.max(0, editor.document.lineCount - 1), editor.document.lineAt(Math.max(0, editor.document.lineCount - 1)).text.length)
    : editor.selection;

  const current = editor.document.getText(selection);
  const result = restoreText(current, 'default');

  if (result.tokensRestored > 0) {
    await editor.edit((editBuilder) => {
      editBuilder.replace(selection, result.restoredText);
    });
  }

  outputChannel.appendLine(`[RESTORE] Restored ${result.tokensRestored} surrogate tokens from volatile RAM.`);
  vscode.window.showInformationMessage(`ZTDS Guard: Restored ${result.tokensRestored} token(s) from volatile RAM.`);
}

function handleAuditDocument() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('ZTDS Guard: Open a document to audit for PII or secret egress.');
    return;
  }

  const text = editor.document.getText();
  const audit = auditDocumentLines(text);
  const diagnostics = audit.findings.map((finding) => {
    const range = new vscode.Range(finding.line, finding.startCol, finding.line, finding.endCol);
    const diag = new vscode.Diagnostic(
      range,
      `ZTDS Guard: Unmasked ${finding.category} detected prior to AI/MCP transmission.`,
      vscode.DiagnosticSeverity.Warning
    );
    diag.source = 'ZTDS RFC v1.0';
    return diag;
  });

  diagnosticCollection.set(editor.document.uri, diagnostics);
  outputChannel.appendLine(`[AUDIT] ${editor.document.fileName} -> ${audit.findings.length} finding(s) | Receipt: ${audit.receiptHash}`);
  outputChannel.show(true);

  if (audit.clean) {
    vscode.window.showInformationMessage(`ZTDS Audit Clean — Receipt ${audit.receiptHash}`);
  } else {
    vscode.window.showWarningMessage(`ZTDS Audit found ${audit.findings.length} exposure(s) — Receipt ${audit.receiptHash}`);
  }
}

function handleResetSession() {
  resetSession('default');
  if (diagnosticCollection) {
    diagnosticCollection.clear();
  }
  updateStatusBar();
  outputChannel.appendLine('[ZEROIZE] Volatile RAM token mappings cleared (Theorem 2).');
  vscode.window.showInformationMessage('ZTDS Guard: Volatile RAM token mappings zeroized.');
}

async function handleConfigureMcp() {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage('ZTDS Guard: Open a workspace folder first to write .vscode/mcp.json.');
    return;
  }

  const vscodeDir = path.join(folders[0].uri.fsPath, '.vscode');
  const mcpPath = path.join(vscodeDir, 'mcp.json');
  const existing = fs.existsSync(mcpPath) ? fs.readFileSync(mcpPath, 'utf8') : '';
  const merged = mergeVscodeMcpConfig(existing);

  fs.mkdirSync(vscodeDir, { recursive: true });
  fs.writeFileSync(mcpPath, merged, 'utf8');

  const doc = await vscode.workspace.openTextDocument(mcpPath);
  await vscode.window.showTextDocument(doc);
  outputChannel.appendLine(`[MCP] Configured ZTDS local stdio firewall in ${mcpPath}`);
  vscode.window.showInformationMessage('ZTDS Guard: Configured local MCP firewall in .vscode/mcp.json.');
}

function activate(context) {
  outputChannel = vscode.window.createOutputChannel('ZTDS Security Audit');
  diagnosticCollection = vscode.languages.createDiagnosticCollection('ztds-security');
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'ztds.auditDocument';
  statusBarItem.tooltip = 'ZTDS Guard (RFC v1.0) — Click to audit active file for PII/secret egress';
  updateStatusBar();
  statusBarItem.show();

  context.subscriptions.push(
    outputChannel,
    diagnosticCollection,
    statusBarItem,
    vscode.commands.registerCommand('ztds.sanitizeSelection', handleSanitizeSelection),
    vscode.commands.registerCommand('ztds.restoreSelection', handleRestoreSelection),
    vscode.commands.registerCommand('ztds.auditDocument', handleAuditDocument),
    vscode.commands.registerCommand('ztds.resetSession', handleResetSession),
    vscode.commands.registerCommand('ztds.configureMcp', handleConfigureMcp)
  );
}

function deactivate() {
  resetSession();
}

module.exports = {
  activate,
  deactivate
};
