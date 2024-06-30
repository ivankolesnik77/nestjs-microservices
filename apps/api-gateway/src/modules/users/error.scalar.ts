import { Scalar } from '@nestjs/graphql';
import { GraphQLScalarType, Kind } from 'graphql';

@Scalar('Error')
export class ErrorScalar extends GraphQLScalarType {
  constructor() {
    super({
      name: 'Error',
      description: 'Error scalar type',
      serialize(value) {
        return value; // value sent to the client
      },
      parseValue(value) {
        return value; // value from the client input variables
      },
      parseLiteral(ast) {
        switch (ast.kind) {
          case Kind.STRING:
            return ast.value;
          default:
            return null; // Invalid input, return null
        }
      },
    });
  }

  // Define a dummy field
  // This field won't affect the scalar behavior, but it's required to satisfy GraphQL's type system
  private __dummyField = 'dummy';
}
