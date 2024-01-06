import { useMutation } from "@tanstack/react-query";
import { Form, Input, Modal, message } from "antd";
import { CreateBoardPesponseI, createBoard } from "../../api/boards";
import { useForm } from "antd/es/form/Form";

interface CreateBoardModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateBoardModal = ({ isOpen, setIsOpen }: CreateBoardModalProps) => {
  const [form] = useForm();
  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (data: CreateBoardPesponseI) => {
      message.success(`New board created. Board alias: ${data.board.alias}.`);
      setIsOpen(false);
    },
    onError: () => {
      message.error("Failed to create new board");
    },
  });

  const handleCreateBoard = (values: any) => {
    createBoardMutation.mutate({
      name: values.name,
    });
  };

  return (
    <Modal
      open={isOpen}
      title={"Create new board"}
      okText={"Create"}
      onOk={() => form.submit()}
      onCancel={() => setIsOpen(false)}
    >
      <Form
        form={form}
        onFinish={handleCreateBoard}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item label="Name" name={"name"} rules={[{ required: true }]}>
          <Input placeholder="Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBoardModal;
