<?php

namespace Drupal\realtime_chat\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\user\Entity\User;

class ChatController extends ControllerBase {

  public function chatPage() {
    return [
      '#theme' => 'realtime_chat',
      '#attached' => [
        'library' => [
          'realtime_chat/realtime_chat',
        ],
      ],
    ];
  }

  public function saveMessage(Request $request) {
    $message = $request->request->get('message');
    $uid = \Drupal::currentUser()->id();
    $created = time();

    \Drupal::database()->insert('chat_messages')
      ->fields([
        'uid' => $uid,
        'message' => $message,
        'created' => $created,
      ])
      ->execute();

    return new JsonResponse(['status' => 'ok']);
  }

  public function getMessages() {
    try {
      $result = \Drupal::database()->select('chat_messages', 'c')
        ->fields('c', ['id', 'uid', 'message', 'created'])
        ->execute()
        ->fetchAll();

      $messages = [];
      foreach ($result as $record) {
        $user = User::load($record->uid);
        $messages[] = [
          'id' => $record->id,
          'username' => $user ? $user->getDisplayName() : 'Anonymous',
          'message' => $record->message,
          'created' => date('Y-m-d H:i:s', $record->created),
        ];
      }

      return new JsonResponse($messages);
    } catch (\Exception $e) {
      watchdog_exception('realtime_chat', $e);
      return new JsonResponse(['error' => 'An error occurred while retrieving messages'], 500);
    }
  }
}

