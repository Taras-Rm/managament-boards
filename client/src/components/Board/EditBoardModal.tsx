import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Modal, message } from "antd";
import { CreateBoardPesponseI, editBoard } from "../../api/boards";
import { useForm } from "antd/es/form/Form";
import { BoardI } from "../../types/board";

interface EditBoardModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  board: BoardI;
}

const EditBoardModal = ({ isOpen, setIsOpen, board }: EditBoardModalProps) => {
  const queryClient = useQueryClient();
  const [form] = useForm();

  const editBoardMutation = useMutation({
    mutationFn: editBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", board.alias],
      });
      message.success(`Board updated!`);
      setIsOpen(false);
    },
    onError: () => {
      message.error("Failed to update board");
    },
  });

  const handleEditBoard = (values: any) => {
    editBoardMutation.mutate({
      name: values.name,
      boardId: board.id,
    });
  };

  return (
    <Modal
      open={isOpen}
      title={"Edit board"}
      okText={"Update"}
      onOk={() => form.submit()}
      onCancel={() => setIsOpen(false)}
    >
      <Form
        form={form}
        onFinish={handleEditBoard}
        layout="vertical"
        requiredMark={false}
        initialValues={board}
      >
        <Form.Item label="Name" name={"name"} rules={[{ required: true }]}>
          <Input placeholder="Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBoardModal;
