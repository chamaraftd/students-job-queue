import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GraphqlService {
  private readonly logger = new Logger(GraphqlService.name);

  async sendStudentsRecords(records) {
    this.logger.debug('Sending Student Data to Graphql EndPoint');
    const headers = {
      'content-type': 'application/json',
    };

    const graphqlQuery = {
      query: `
      mutation createStudent($createStudentInput: [CreateStudentInput!]!){
        createStudent(createStudentInput: $createStudentInput) {
          id,
          name
          dob
        }
      }
      `,
      variables: {
        createStudentInput: records,
      },
    };

    try {
      const results = await axios({
        url: process.env.FEDERATION_ENDPOINT,
        method: 'post',
        headers: headers,
        data: graphqlQuery,
      });
      return results;
    } catch (error) {
      this.logger.error(`User Creation Failed : ${error}`);
    }
  }
}
