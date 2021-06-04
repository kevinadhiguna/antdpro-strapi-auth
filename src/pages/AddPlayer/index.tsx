import { useState } from 'react';
import ProForm, {
  StepsForm,
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormDateRangePicker,
  ProFormDependency,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Button, message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const AddPlayer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  return (
    <ProCard>
      <StepsForm
        onFinish={async () => {
          setLoading(true);
          await waitTime(1000);
          message.success('Submitted successfully');
          setLoading(false);
        }}
        submitter={{
          render: ({ form, onSubmit, step, onPre }) => {
            return [
              <Button
                key="rest"
                onClick={() => {
                  form?.resetFields();
                }}
              >
                Reset
              </Button>,
              step > 0 && (
                <Button
                  key="pre"
                  onClick={() => {
                    onPre?.();
                  }}
                >
                  Back
                </Button>
              ),
              <Button
                key="next"
                loading={loading}
                type="primary"
                onClick={() => {
                  onSubmit?.();
                }}
              >
                Next
              </Button>,
            ];
          },
        }}
        formProps={{
          validateMessages: {
            required: 'This is required',
          },
        }}
      >
        <StepsForm.StepForm
          name="base"
          title="Create experiment"
          onFinish={async () => {
            setLoading(true);
            await waitTime(2000);
            setLoading(false);
            return true;
          }}
        >
          <ProFormText
            name="name"
            label="Experiment name"
            width="md"
            tooltip="The longest is 24 digits, the unique id used for calibration"
            placeholder="Please enter a name"
            rules={[{ required: true }]}
          />
          <ProFormDatePicker name="date" label="Date" />
          <ProFormDateRangePicker name="dateTime" label="Time Interval" />
          <ProFormTextArea name="remark" label="Remarks" width="lg" placeholder="Please enter a note" />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="checkbox" title="Setting Parameters">
          <ProFormCheckbox.Group
            name="checkbox"
            label="Migration type"
            width="lg"
            options={['Structure migration', 'Full migration', 'Incremental migration', 'Full calibration']}
          />
          <ProForm.Group>
            <ProFormText name="dbName" label="Business DB Username" />
            <ProFormDatePicker name="datetime" label="Record retention time" width="sm" />
          </ProForm.Group>
          <ProFormDependency name={['dbName']}>
            {({ dbName }) => {
              return (
                <ProFormCheckbox.Group
                  name="checkbox"
                  label="Migration type"
                  options={dbName ? ['Full LOB', 'LOB out of sync', 'Restricted LOB'] : ['Full LOB']}
                />
              );
            }}
          </ProFormDependency>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="Publish Experiment">
          <ProFormCheckbox.Group
            name="checkbox"
            label="Deployment unit"
            rules={[
              {
                required: true,
              },
            ]}
            options={['Deployment unit 1', 'Deployment unit 2', 'Deployment unit 3']}
          />
          <ProFormSelect
            label="Deploy group strategy"
            name="remark"
            rules={[
              {
                required: true,
              },
            ]}
            initialValue="1"
            width="md"
            options={[
              {
                value: '1',
                label: 'Strategy One',
              },
              { value: '2', label: 'Strategy Two' },
            ]}
          />
          <ProFormSelect
            label="Pod scheduling strategy"
            name="remark2"
            initialValue="2"
            width="md"
            options={[
              {
                value: '1',
                label: 'Strategy One',
              },
              { value: '2', label: 'Strategy Two' },
            ]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};

export default AddPlayer;
