import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Body,
  Post,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { IssueConversationService } from './issues_conversation.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('issue_conversation')
@ApiTags('issue_conversation')
export class IssueConversationController {
  constructor(
    private readonly issueConversationService: IssueConversationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Llista totes les converses de les incidències.' })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  async getAllIssueConversation(@Query('xml') xml: string) {
    const conversations =
      await this.issueConversationService.getAllIssueConversation(xml);
    return conversations;
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID de la conversa.', type: 'integer' })
  async getIssueConversation(
    @Param('id') id: string,
    @Query('xml') xml: string,
  ) {
    const issueConversationId = parseInt(id);
    if (isNaN(issueConversationId)) {
      throw new HttpException('Invalid issue ID', HttpStatus.BAD_REQUEST);
    }

    const conversations =
      await this.issueConversationService.getIssueConversation(
        issueConversationId,
        xml,
      );

    return conversations;
  }

  @Post()
  @ApiBody({
    description: "Dades per crear una nova conversa d'incidència.",
    type: Object,
  })
  @ApiResponse({
    status: 201,
    description: "Conversa d'incidència creada correctament.",
  })
  createIssueConversation(@Body() body: any) {
    return this.issueConversationService.createIssueConversation(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Elimina una conversa d'incidència." })
  @ApiParam({
    name: 'id_conversation',
    description: 'ID de la conversa a eliminar.',
    type: 'integer',
  })
  deleteIssueConversation(@Param('id') id_conversation: string) {
    const conversationId = parseInt(id_conversation);
    if (isNaN(conversationId)) {
      throw new HttpException(
        'Invalid conversation ID',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.issueConversationService.deleteIssueConversation(
      conversationId,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: "Actualitza una conversa d'incidència." })
  @ApiBody({
    description: 'Notes a actualitzar a la conversa.',
    type: String,
  })
  updateIssueConversation(
    @Param('id') id_conversation: string,
    @Body('notes') notes: string,
  ) {
    const conversationId = parseInt(id_conversation);
    if (isNaN(conversationId)) {
      throw new HttpException(
        'Invalid conversation ID',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!notes) {
      throw new HttpException('Notes cannot be empty', HttpStatus.BAD_REQUEST);
    }

    return this.issueConversationService.updateIssueConversation(
      conversationId,
      notes,
    );
  }
}
