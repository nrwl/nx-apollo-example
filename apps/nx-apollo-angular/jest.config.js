module.exports = {
  name: 'nx-apollo-angular',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/nx-apollo-angular',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
