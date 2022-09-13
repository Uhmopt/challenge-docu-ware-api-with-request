import * as DWRest from 'src/types/DW_Rest';

/**
 * Returns special field by name
 * Also proofs if system field is tried to manipulate
 *
 * @param {DWRest.IDocument} document
 * @param {string} fieldName
 * @returns {DWRest.IDocumentIndexField}
 */
export function getFieldByName(
  document: DWRest.IDocument,
  fieldName: string,
): DWRest.IDocumentIndexField {
  if (Object.keys(document).length === 0) {
    throw new Error(`document is empty!`);
  }

  if (document.Fields?.length === 0) {
    throw new Error(`Fields is empty!`);
  }

  const field = document.Fields?.find(
    (f) => f.fieldName.toLowerCase() === fieldName.toLowerCase(),
  );

  if (!field) {
    throw new Error(
      `Field '${fieldName}' does not exist on document '${document.Id}'!`,
    );
  }

  return field;
}
