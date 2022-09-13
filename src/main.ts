import { NestFactory } from '@nestjs/core';
import * as DWRest from 'src/types/DW_Rest';
import { DOCUWARE } from './config/docuware.config';
import {
  DialogExpression,
  DialogExpressionCondition,
} from './DialogExpression';
import { DocuwareModule } from './docuware/docuware.module';
import { DocuwareService } from './docuware/docuware.service';
import { devLog } from './utils/devTools';
import { getFieldByName } from './utils/document';

//connection data
const user = DOCUWARE.USER_NAME;
const password = DOCUWARE.PASSWORD;
const organization = DOCUWARE.ORGANIZATION;
const hostID = DOCUWARE.HOST_ID; //has to be unique per machine
const fileCabinetID = DOCUWARE.FILE_CABINET_ID;

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(DocuwareModule);
  const docuwareService = app.get(DocuwareService);

  //Create Login Model
  const logonModel: DWRest.ILogonModel = docuwareService.CreateLogonModel(
    user,
    password,
    organization,
    hostID,
  );
  devLog(logonModel);

  const fileCabinet: DWRest.IFileCabinet = await docuwareService.GetFileCabinet(
    fileCabinetID,
  );
  const dialogs: DWRest.IDialog[] =
    await docuwareService.GetDedicatedDialogsFromFileCabinet(
      fileCabinet,
      DWRest.DialogType.Search,
    );
  const firstDialog: DWRest.IDialog =
    await docuwareService.LoadFullObjectFromPlatform<DWRest.IDialog>(
      dialogs[0],
    );

  // search
  const dialogExpression = new DialogExpression(DWRest.Operation.And, [
    new DialogExpressionCondition('COMPANY', [
      'Home Improvement',
      'Peters Engineering',
    ]),
    new DialogExpressionCondition('DOCUMENT_TYPE', ['Invoice out']),
  ]);
  const query: string = await docuwareService.GetQueryUrlFromFileCabinet(
    fileCabinet,
    dialogExpression,
    firstDialog.Id,
    firstDialog.Query.Fields,
    'COMPANY',
    DWRest.SortOrder.Desc,
  );
  const searchResult: DWRest.IDocumentsQueryResult =
    await docuwareService.GetQueryResults(query);
  devLog(searchResult);

  // update a document
  const specialDocument: DWRest.IDocument =
    await docuwareService.GetDocumentByDocID(fileCabinet, 89);
  const customFieldOfDocument: DWRest.IDocumentIndexField = getFieldByName(
    specialDocument,
    'Status',
  ); //Status is a custom field in filecabinet
  //Update field value
  customFieldOfDocument.item = 'Booked!';
  const updatedDocumentFields: DWRest.IFieldList =
    await docuwareService.UpdateDocumentIndexValues(specialDocument, {
      Field: [customFieldOfDocument],
    });
  devLog(updatedDocumentFields);

  // upload
  const indexEntries: DWRest.IDocumentIndexField[] = [
    {
      fieldName: 'Company',
      item: 'Doc Name Test Inc',
      itemElementName: DWRest.ItemChoiceType.String,
    },
    {
      fieldName: 'Status',
      item: 'Uploaded by REST',
      itemElementName: DWRest.ItemChoiceType.String,
    },
  ];
  const newCreatedDocument: DWRest.IDocument =
    await docuwareService.UploadDocument(
      fileCabinet,
      indexEntries,
      DOCUWARE.TEST_FILE,
    );
  devLog(newCreatedDocument);
}

bootstrap();
